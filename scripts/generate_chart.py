import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import matplotlib.ticker as mtick
from datetime import datetime, timedelta

def fetch_cpi_data():
    # Fetch real data from FRED: Consumer Price Index (CPIAUCSL)
    url = "https://fred.stlouisfed.org/graph/fredgraph.csv?id=CPIAUCSL"
    df = pd.read_csv(url)
    df['observation_date'] = pd.to_datetime(df['observation_date'])
    df['CPIAUCSL'] = pd.to_numeric(df['CPIAUCSL'], errors='coerce')
    df = df.dropna().set_index('observation_date')
    
    # Calculate YoY change (%)
    df['Inflation'] = df['CPIAUCSL'].pct_change(periods=12) * 100
    df = df.dropna()
    
    # Filter for the last 5 years
    five_years_ago = datetime.now() - timedelta(days=5*365)
    df = df[df.index >= five_years_ago]
    
    return df

def generate_chart():
    df = fetch_cpi_data()

    # Horacle Style Colors
    bg_color = '#0F172A' 
    line_color = '#2563EB' 
    grid_color = '#1E293B'
    text_color = '#FFFFFF'
    dim_color = '#94A3B8'

    fig, ax = plt.subplots(figsize=(10, 5), facecolor=bg_color)
    ax.set_facecolor(bg_color)

    # Plot data
    ax.plot(df.index, df['Inflation'], color=line_color, linewidth=3, zorder=3)
    
    # Fill under curve
    ax.fill_between(df.index, df['Inflation'], alpha=0.1, color=line_color, zorder=2)

    # Latest value marker
    last_date = df.index[-1]
    last_val = df['Inflation'].iloc[-1]
    
    # War / Oil Shock marker (Approximate for visual context)
    # Ukraine war started Feb 2022
    war_start = pd.Timestamp('2022-02-24')
    if war_start in df.index or war_start > df.index[0]:
        ax.axvline(x=war_start, color='#F87171', linestyle='--', linewidth=1.5, alpha=0.5, zorder=1)
        ax.text(war_start, ax.get_ylim()[1] * 0.9, "Choc énergétique (2022)", 
                color='#F87171', fontsize=8, ha='right', va='top', alpha=0.8, rotation=90)

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
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%b %y'))

    # Title & Subtitle (Centered)
    plt.suptitle("US CPI INFLATION (YoY %)", x=0.5, y=0.98, ha='center', fontsize=18, fontweight='bold', color=text_color, fontname='sans-serif')
    plt.title("Évolution sur les 24 derniers mois", loc='center', fontsize=10, color=dim_color, pad=15, fontname='sans-serif')

    # Data Source / Branding (Bottom Right, outside plot area)
    fig.text(0.95, 0.02, "Source : FRED / HORACLE CAPITAL", fontsize=8, fontweight='bold', color=dim_color, ha='right', alpha=0.7, fontname='sans-serif')

    # Add a glowing dot at the end
    last_date = df.index[-1]
    last_val = df['Inflation'].iloc[-1]
    ax.scatter(last_date, last_val, color=bg_color, edgecolor=line_color, linewidth=2, s=80, zorder=4)
    
    # Add label for last value
    ax.annotate(f"{last_val:.1f}%", 
                xy=(last_date, last_val), 
                xytext=(10, 0), 
                textcoords="offset points",
                color=text_color,
                fontweight='bold',
                fontsize=12,
                va='center')

    plt.tight_layout(rect=[0, 0.05, 1, 0.93]) # Make room for suptitle and bottom text
    
    output_path = "public/assets/img/us_inflation_2y_horacle.png"
    plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor=bg_color)
    print(f"Chart successfully saved to {output_path}")

if __name__ == "__main__":
    generate_chart()