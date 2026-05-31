import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import matplotlib.ticker as mtick
from datetime import datetime, timedelta
import yfinance as yf

# Configuration du style Horacle
BG_COLOR = '#0F172A'
TEXT_COLOR = '#FFFFFF'
DIM_COLOR = '#94A3B8'
GRID_COLOR = '#1E293B'
PRIMARY_COLOR = '#2563EB'  # Blue
SECONDARY_COLOR = '#F59E0B' # Amber
DANGER_COLOR = '#EF4444'   # Red

def setup_ax(ax, title, subtitle):
    ax.set_facecolor(BG_COLOR)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_visible(False)
    ax.spines['bottom'].set_color(GRID_COLOR)
    ax.grid(True, axis='y', color=GRID_COLOR, linestyle='--', alpha=0.7, zorder=1)
    ax.tick_params(axis='x', colors=DIM_COLOR, labelsize=9, bottom=False)
    ax.tick_params(axis='y', colors=DIM_COLOR, labelsize=9, left=False)
    
    plt.suptitle(title, x=0.5, y=0.98, ha='center', fontsize=16, fontweight='bold', color=TEXT_COLOR)
    plt.title(subtitle, loc='center', fontsize=10, color=DIM_COLOR, pad=15)

def save_chart(fig, path):
    fig.text(0.95, 0.02, "Source : yfinance / FRED / HORACLE CAPITAL", fontsize=7, fontweight='bold', color=DIM_COLOR, ha='right', alpha=0.7)
    plt.tight_layout(rect=[0, 0.05, 1, 0.93])
    plt.savefig(path, dpi=300, bbox_inches='tight', facecolor=BG_COLOR)
    print(f"Chart saved to {path}")

def generate_dxy_chart():
    print("Fetching DXY data...")
    dxy = yf.download('DX-Y.NYB', start=(datetime.now() - timedelta(days=180)), end=datetime.now())
    if dxy.empty: return
    
    if isinstance(dxy.columns, pd.MultiIndex):
        dxy.columns = dxy.columns.get_level_values(0)
    
    fig, ax = plt.subplots(figsize=(10, 5), facecolor=BG_COLOR)
    setup_ax(ax, "DOLLAR INDEX (DXY) - MOMENTUM HAUSSIER", "Réaction aux tensions géopolitiques et différentiels de taux")
    
    close_prices = dxy['Close'].values.flatten()
    ax.plot(dxy.index, close_prices, color=SECONDARY_COLOR, linewidth=2.5, zorder=3)
    ax.fill_between(dxy.index, close_prices.min(), close_prices, alpha=0.1, color=SECONDARY_COLOR, zorder=2)
    
    last_date = dxy.index[-1]
    last_val = float(close_prices[-1])
    ax.scatter(last_date, last_val, color=BG_COLOR, edgecolor=SECONDARY_COLOR, linewidth=2, s=60, zorder=4)
    ax.annotate(f"{last_val:.2f}", xy=(last_date, last_val), xytext=(8, 0), textcoords="offset points", color=TEXT_COLOR, fontweight='bold', fontsize=11, va='center')
    
    save_chart(fig, "public/assets/img/dxy_momentum_june.png")

def generate_yield_spread_chart():
    print("Fetching Yield data (US10Y vs DE10Y)...")
    # US 10Y (TNX) and DE 10Y (using proxy or FRED if available, let's try TNX and EUR bond proxy)
    # Better to use FRED for accuracy on DE10Y
    try:
        us10y_url = "https://fred.stlouisfed.org/graph/fredgraph.csv?id=DGS10"
        de10y_url = "https://fred.stlouisfed.org/graph/fredgraph.csv?id=IRLTLT01DEM156N" # Germany 10Y
        
        us = pd.read_csv(us10y_url)
        de = pd.read_csv(de10y_url)
        
        for df in [us, de]:
            df['observation_date'] = pd.to_datetime(df['observation_date'])
            df.iloc[:, 1] = pd.to_numeric(df.iloc[:, 1], errors='coerce')
        
        df = pd.merge(us, de, on='observation_date').dropna()
        df['Spread'] = df['DGS10'] - df.iloc[:, 2]
        df = df[df['observation_date'] >= (datetime.now() - timedelta(days=365))]
        
        fig, ax = plt.subplots(figsize=(10, 5), facecolor=BG_COLOR)
        setup_ax(ax, "SPREAD DE TAUX 10Y : USA vs ALLEMAGNE", "Compression du différentiel de rendement réel et pression sur l'EUR")
        
        ax.plot(df['observation_date'], df['Spread'], color=PRIMARY_COLOR, linewidth=2.5, zorder=3)
        ax.fill_between(df['observation_date'], df['Spread'].min(), df['Spread'], alpha=0.1, color=PRIMARY_COLOR, zorder=2)
        
        last_date = df['observation_date'].iloc[-1]
        last_val = df['Spread'].iloc[-1]
        ax.scatter(last_date, last_val, color=BG_COLOR, edgecolor=PRIMARY_COLOR, linewidth=2, s=60, zorder=4)
        ax.annotate(f"{last_val:.2f}%", xy=(last_date, last_val), xytext=(8, 0), textcoords="offset points", color=TEXT_COLOR, fontweight='bold', fontsize=11, va='center')
        
        ax.yaxis.set_major_formatter(mtick.PercentFormatter(decimals=2))
        save_chart(fig, "public/assets/img/yield_spread_us_de.png")
    except Exception as e:
        print(f"Error generating spread chart: {e}")

if __name__ == "__main__":
    generate_dxy_chart()
    generate_yield_spread_chart()
