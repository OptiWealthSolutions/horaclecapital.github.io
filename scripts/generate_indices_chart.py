import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from datetime import datetime, timedelta
import warnings

# Suppress yfinance warnings
warnings.filterwarnings('ignore')

# Horacle Style Constants
BG_COLOR = '#0F172A'
BLUE_PRIMARY = '#2563EB'
BLUE_LIGHT = '#60A5FA'
GRID_COLOR = '#1E293B'
TEXT_COLOR = '#FFFFFF'
DIM_COLOR = '#94A3B8'
ACCENT_COLORS = ['#2563EB', '#60A5FA', '#38BDF8', '#93C5FD'] # Various blues for the lines

def fetch_and_plot():
    # Tickers for the indices/ETFs
    # URTH: iShares MSCI World ETF
    # SPY: SPDR S&P 500 ETF Trust
    # EEM: iShares MSCI Emerging Markets ETF
    # EZU: iShares MSCI Eurozone ETF (Proxy for EURO STOXX)
    tickers = {
        'MSCI World': 'URTH',
        'S&P 500': '^GSPC',
        'MSCI Emerging Markets': 'EEM',
        'EURO STOXX 600': '^STOXX'
    }

    end_date = datetime.now()
    start_date = end_date - timedelta(days=5*365)

    df_list = []
    
    print("Fetching data from Yahoo Finance...")
    for name, ticker in tickers.items():
        try:
            data = yf.download(ticker, start=start_date, end=end_date, progress=False)
            if not data.empty:
                # Use Adjusted Close if available, else Close
                if 'Adj Close' in data.columns:
                    series = data['Adj Close']
                else:
                    series = data['Close']
                
                # Normalize to base 100 at the start
                normalized = (series / series.iloc[0]) * 100
                normalized.name = name
                df_list.append(normalized)
            else:
                print(f"Warning: No data found for {name} ({ticker})")
        except Exception as e:
            print(f"Error fetching {name}: {e}")

    if not df_list:
        print("Error: No data could be fetched.")
        return

    # Combine into a single DataFrame
    df = pd.concat(df_list, axis=1)
    # Forward fill any missing values (e.g. due to different holiday schedules)
    df = df.ffill().dropna()

    print("Data fetched successfully. Generating chart...")

    # Plotting
    fig, ax = plt.subplots(figsize=(12, 7), facecolor=BG_COLOR)
    ax.set_facecolor(BG_COLOR)

    # Plot each line
    for i, column in enumerate(df.columns):
        color = ACCENT_COLORS[i % len(ACCENT_COLORS)]
        # Make S&P 500 stand out slightly more if desired, or keep them equal
        linewidth = 2.5
        alpha = 0.9
        
        if column == 'S&P 500':
            linewidth = 3.5
            color = '#FFFFFF' # White for S&P 500 to stand out
        elif column == 'MSCI World':
            color = '#60A5FA' # Light blue
        elif column == 'EURO STOXX 600':
            color = '#2563EB' # Primary blue
        elif column == 'MSCI Emerging Markets':
            color = '#38BDF8' # Sky blue

        ax.plot(df.index, df[column], label=column, color=color, linewidth=linewidth, alpha=alpha, zorder=3)
        
        # Add a subtle dot at the end
        last_date = df.index[-1]
        last_val = df[column].iloc[-1]
        ax.scatter(last_date, last_val, color=color, s=40, zorder=4)
        
        # Annotate last value
        ax.annotate(f"{last_val:.0f}", 
                    xy=(last_date, last_val), 
                    xytext=(8, 0), 
                    textcoords="offset points",
                    color=color,
                    fontweight='bold',
                    fontsize=10,
                    va='center')

    # Add reference line for Base 100
    ax.axhline(y=100, color=DIM_COLOR, linestyle='--', linewidth=1, alpha=0.5, zorder=2)
    ax.text(df.index[0], 100, " Base 100", color=DIM_COLOR, fontsize=9, va='bottom', ha='left')

    # Formatting
    ax.set_xlabel('ANNÉE', color=DIM_COLOR, fontsize=10, fontweight='bold', labelpad=15)
    ax.set_ylabel('PERFORMANCE RELATIVE (Base 100)', color=DIM_COLOR, fontsize=10, fontweight='bold', labelpad=15)
    
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y'))
    
    # Spines
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color(GRID_COLOR)
    ax.spines['bottom'].set_color(GRID_COLOR)

    # Grid
    ax.grid(True, axis='y', color=GRID_COLOR, linestyle='--', alpha=0.5, zorder=1)
    ax.grid(True, axis='x', color=GRID_COLOR, linestyle='-', alpha=0.2, zorder=1)

    # Ticks
    ax.tick_params(axis='both', colors=DIM_COLOR, labelsize=10)

    # Titles
    plt.suptitle("PERFORMANCE COMPARÉE DES GRANDS INDICES", x=0.5, y=0.96, ha='center', fontsize=20, fontweight='bold', color=TEXT_COLOR)
    plt.title("Évolution sur les 5 dernières années (Base 100)", loc='center', fontsize=12, color=BLUE_PRIMARY, pad=20)

    # Legend
    leg = ax.legend(loc='upper left', facecolor=BG_COLOR, edgecolor=GRID_COLOR, fontsize=10, framealpha=0.9)
    for text in leg.get_texts():
        text.set_color(TEXT_COLOR)

    # Branding
    fig.text(0.95, 0.02, "Source : Yahoo Finance / HORACLE CAPITAL", fontsize=8, fontweight='bold', color=DIM_COLOR, ha='right', alpha=0.5)

    plt.tight_layout(rect=[0, 0.05, 0.95, 0.95]) # Make room for annotations on the right
    
    output_path = "public/assets/img/visuals/indices_comparison_5y.png"
    plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor=BG_COLOR)
    print(f"Chart successfully saved to {output_path}")

if __name__ == "__main__":
    fetch_and_plot()
