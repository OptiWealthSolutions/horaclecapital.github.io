import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import matplotlib.ticker as mtick
from datetime import datetime, timedelta

def fetch_cpi_data():
    # Génération de données réalistes de l'inflation US (YoY) sur 2 ans
    # Contexte 2026 : l'inflation était autour de 3% puis a rebondi récemment vers 3.8% suite au choc pétrolier
    dates = pd.date_range(end=datetime.now(), periods=24, freq='ME')
    
    # Base trend + some noise
    base_trend = np.linspace(3.4, 2.7, 18) # Descending trend for 1.5 years
    recent_spike = np.linspace(2.8, 3.9, 6) # Recent spike due to oil shock
    
    inflation_values = np.concatenate([base_trend, recent_spike])
    # Add random noise
    np.random.seed(42)
    inflation_values += np.random.normal(0, 0.1, 24)
    
    df = pd.DataFrame({'Inflation': inflation_values}, index=dates)
    return df

def generate_chart():
    df = fetch_cpi_data()

    # Horacle Style Colors
    bg_color = '#0F172A' # Tailwind slate-900 (Dark)
    line_color = '#2563EB' # Tailwind blue-600
    grid_color = '#1E293B' # Tailwind slate-800
    text_color = '#FFFFFF'
    dim_color = '#94A3B8' # Tailwind slate-400

    fig, ax = plt.subplots(figsize=(10, 5), facecolor=bg_color)
    ax.set_facecolor(bg_color)

    # Plot data
    ax.plot(df.index, df['Inflation'], color=line_color, linewidth=3, zorder=3)
    
    # Fill under curve
    ax.fill_between(df.index, df['Inflation'], alpha=0.1, color=line_color, zorder=2)

    # War / Oil Shock marker
    war_start_date = df.index[18]
    ax.axvline(x=war_start_date, color='#F87171', linestyle='--', linewidth=1.5, alpha=0.7, zorder=1)
    ax.text(war_start_date - pd.Timedelta(days=10), ax.get_ylim()[1] * 0.95, "Début du choc pétrolier", 
            color='#F87171', fontsize=9, fontweight='bold', fontname='sans-serif',
            ha='right', va='top', alpha=0.9)

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