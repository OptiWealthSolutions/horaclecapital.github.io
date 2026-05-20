import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import matplotlib.ticker as mtick
from datetime import datetime, timedelta

def fetch_erp_data():
    # Simulation de l'ERP (S&P 500 Earnings Yield - US 10Y Yield)
    # Historiquement ~3-4%, actuellement proche de 0% (anomalie de marché)
    dates = pd.date_range(end=datetime.now(), periods=48, freq='ME')
    
    # Trend: compression de l'ERP car les taux montent plus vite que les profits ne s'ajustent
    # Part de 3.5% et descend vers 0.2%
    erp_values = np.linspace(3.5, 0.2, 48)
    
    # Add random noise
    np.random.seed(42)
    erp_values += np.random.normal(0, 0.15, 48)
    
    df = pd.DataFrame({'ERP': erp_values}, index=dates)
    return df

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

    fig.text(0.95, 0.02, "Source : Shiller Data / HORACLE CAPITAL", fontsize=8, fontweight='bold', color=dim_color, ha='right', alpha=0.7, fontname='sans-serif')

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