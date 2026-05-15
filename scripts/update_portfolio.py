import yfinance as yf
import yaml
import os
import re
from datetime import datetime
import pandas as pd
import numpy as np

# Configuration
PORTFOLIO_DIR = "src/content/portfolios"
RISK_FREE_RATE = 0.04  # 4% assumption for Sharpe Ratio

def parse_weight(weight_str):
    """Convert '15%' or '-5%' to 0.15 or -0.05"""
    try:
        return float(weight_str.strip('%')) / 100.0
    except:
        return 0.0

def update_portfolio_file(file_path):
    print(f"Processing {file_path}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split frontmatter and content
    parts = re.split(r'---\s*\n', content)
    if len(parts) < 3:
        print(f"Skipping {file_path}: Invalid format")
        return

    # parts[0] is empty, parts[1] is frontmatter, parts[2] is markdown body
    try:
        data = yaml.safe_load(parts[1])
    except Exception as e:
        print(f"Error parsing YAML in {file_path}: {e}")
        return

    positions = data.get('positions', [])
    
    if not positions:
        print(f"No positions found in {file_path}")
        return

    # Ensure stats block exists
    if 'stats' not in data:
        data['stats'] = {'ytd': '0%', 'sharpe': '0', 'volatility': '0%'}

    tickers = []
    weights = []
    
    # Pre-process positions to fill missing info
    for i, pos in enumerate(positions):
        ticker = pos.get('ticker')
        if not ticker:
            continue
            
        tickers.append(ticker)
        weights.append(parse_weight(pos.get('weight', '0%')))
        
        # Auto-fill missing required fields for Astro schema
        if not pos.get('asset'):
            try:
                info = yf.Ticker(ticker).info
                pos['asset'] = info.get('shortName') or info.get('longName') or ticker
            except:
                pos['asset'] = ticker
        
        if not pos.get('type'):
            pos['type'] = 'Asset'
            
        if not pos.get('conviction'):
            pos['conviction'] = 'Medium'
            
        if not pos.get('weight'):
            pos['weight'] = '0%'

    if not tickers:
        print(f"No tickers with data found in {file_path}")
        return

    # Fetch historical data (1 year for volatility and YTD)
    print(f"Fetching data for {tickers}...")
    data_download = yf.download(tickers, period="1y", interval="1d")
    
    # Handle MultiIndex or single index returned by yfinance
    if 'Adj Close' in data_download.columns.levels[0] if isinstance(data_download.columns, pd.MultiIndex) else 'Adj Close' in data_download.columns:
        df = data_download['Adj Close']
    elif 'Close' in data_download.columns.levels[0] if isinstance(data_download.columns, pd.MultiIndex) else 'Close' in data_download.columns:
        df = data_download['Close']
    else:
        print(f"Error: Could not find Close prices in data for {tickers}")
        return

    if isinstance(df, pd.Series):
        df = df.to_frame()
        df.columns = tickers
    
    # Ensure all tickers are in the dataframe
    missing = [t for t in tickers if t not in df.columns]
    if missing:
        print(f"Warning: Missing data for {missing}")
        # Only keep weights for tickers we have data for
        valid_tickers = [t for t in tickers if t in df.columns]
        weights = [weights[tickers.index(t)] for t in valid_tickers]
        tickers = valid_tickers
        if not tickers: return

    # Calculate returns
    returns = df[tickers].pct_change().dropna()
    
    # Calculate Portfolio Daily Returns (weighted)
    # Note: This assumes static weights over the period for calculation simplicity
    weighted_returns = returns[tickers] * weights
    portfolio_returns = weighted_returns.sum(axis=1)

    # 1. YTD Calculation
    current_year = datetime.now().year
    ytd_start = f"{current_year}-01-01"
    if ytd_start in df.index:
        ytd_prices = df.loc[ytd_start:]
    else:
        # Fallback to the first available price of the year
        ytd_prices = df[df.index.year == current_year]
    
    if not ytd_prices.empty:
        # Simplified YTD based on weighted individual YTDs
        start_prices = ytd_prices.iloc[0]
        end_prices = ytd_prices.iloc[-1]
        individual_ytd = (end_prices / start_prices) - 1
        portfolio_ytd = (individual_ytd * weights).sum()
    else:
        portfolio_ytd = 0

    # 2. Volatility (Annualized)
    volatility = portfolio_returns.std() * np.sqrt(252)

    # 3. Sharpe Ratio
    excess_return = portfolio_returns.mean() * 252 - RISK_FREE_RATE
    sharpe = excess_return / (portfolio_returns.std() * np.sqrt(252)) if volatility != 0 else 0

    # Update Frontmatter
    data['lastUpdated'] = datetime.now().strftime("%Y-%m-%d")
    data['stats']['ytd'] = f"{portfolio_ytd:+.2%}"
    data['stats']['volatility'] = f"{volatility:.2%}"
    data['stats']['sharpe'] = f"{sharpe:.2f}"

    # Reconstruct file
    new_frontmatter = yaml.dump(data, allow_unicode=True, sort_keys=False)
    new_content = f"---\n{new_frontmatter}---\n{parts[2]}"
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Updated {file_path}: YTD={data['stats']['ytd']}, Sharpe={data['stats']['sharpe']}")

if __name__ == "__main__":
    for filename in os.listdir(PORTFOLIO_DIR):
        if filename.endswith(".md"):
            update_portfolio_file(os.path.join(PORTFOLIO_DIR, filename))
