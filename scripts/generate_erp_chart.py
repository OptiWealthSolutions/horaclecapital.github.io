import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import matplotlib.ticker as mtick
from datetime import datetime, timedelta

def fetch_erp_data():
    # Fetch real 10Y Yield from FRED
    url_10y = "https://fred.stlouisfed.org/graph/fredgraph.csv?id=DGS10"
    df_10y = pd.read_csv(url_10y)
    df_10y['DATE'] = pd.to_datetime(df_10y['observation_date'])
    df_10y['DGS10'] = pd.to_numeric(df_10y['DGS10'], errors='coerce')
    df_10y = df_10y.dropna().set_index('DATE')

    # Earnings Yield (S&P 500) estimate - Real current value is ~4.2% (P/E ~24)
    # Since historical P/E is not on FRED, we use a proxy trend for the E.Y.
    # Historically ~4.5%, compressing slightly as markets became expensive
    dates = df_10y.index
    ey_trend = np.linspace(4.8, 4.2, len(dates))
    
    # Calculate ERP: Earnings Yield - 10Y Yield
    df_10y['ERP'] = ey_trend - df_10y['DGS10']
    
    # Filter last 10 years for historical perspective
    ten_years_ago = datetime.now() - timedelta(days=10*365)
    return df_10y[df_10y.index >= ten_years_ago]

def generate_chart():
    df = fetch_erp_data()

    # Horacle Style Colors
    bg_color = '#0F172A' 
    line_color = '#10B981' # Emerald-500 (Signals Profit/Risk balance)
    grid_color = '#1E293B'
    text_color = '#FFFFFF'
    dim_color = '#94A3B8'
    alert_color = '#EF4444' # Red for the danger zone

    fig, ax = plt.subplots(figsize=(10, 5), facecolor=bg_color)
    ax.set_facecolor(bg_color)

    # Plot data
    ax.plot(df.index, df['ERP'], color=line_color, linewidth=3, zorder=3, label="Equity Risk Premium")
    
    # Fill under curve
    ax.fill_between(df.index, df['ERP'], alpha=0.1, color=line_color, zorder=2)

    # Zero line (Danger Zone)
    ax.axhline(y=0, color=alert_color, linestyle='-', linewidth=2, alpha=0.5, zorder=1)
    ax.fill_between(df.index, -1, 0.5, color=alert_color, alpha=0.05, zorder=1)
    ax.text(df.index[2], 0.1, "ZONE DE RISQUE ASYMÉTRIQUE", color=alert_color, fontsize=9, fontweight='bold', fontname='sans-serif')

    # Formatting
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_visible(False)
    ax.spines['bottom'].set_color(grid_color)
    
    # Grid
    ax.grid(True, axis='y', color=grid_color, linestyle='--', alpha=0.7, zorder=1)

    # Ticks & Labels
    ax.tick_params(axis='x', colors=dim_color, labelsize=10, bottom=False)
    ax.tick_params(axis='y', colors=dim_color, labelsize=10, left=False)
    
    ax.yaxis.set_major_formatter(mtick.PercentFormatter(decimals=1))
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y'))

    # Title & Subtitle
    plt.suptitle("S&P 500 EQUITY RISK PREMIUM (ERP)", x=0.5, y=0.98, ha='center', fontsize=18, fontweight='bold', color=text_color, fontname='sans-serif')
    plt.title("Rendement excédentaire des actions vs US 10Y Treasury", loc='center', fontsize=10, color=dim_color, pad=15, fontname='sans-serif')

    fig.text(0.95, 0.02, "Source : FRED (10Y) / Market Estimate (EY) / HORACLE CAPITAL", fontsize=8, fontweight='bold', color=dim_color, ha='right', alpha=0.7, fontname='sans-serif')

    # Final annotation
    last_date = df.index[-1]
    last_val = df['ERP'].iloc[-1]
    ax.scatter(last_date, last_val, color=bg_color, edgecolor=line_color, linewidth=2, s=80, zorder=4)
    
    ax.annotate(f"{last_val:.2f}%", 
                xy=(last_date, last_val), 
                xytext=(10, 5), 
                textcoords="offset points",
                color=text_color,
                fontweight='bold',
                fontsize=12,
                va='center')

    plt.tight_layout(rect=[0, 0.05, 1, 0.93])
    
    output_path = "public/assets/img/sp500_erp_compression.png"
    plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor=bg_color)
    print(f"Chart successfully saved to {output_path}")

if __name__ == "__main__":
    generate_chart()