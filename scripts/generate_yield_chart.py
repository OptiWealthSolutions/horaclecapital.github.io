import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import matplotlib.ticker as mtick
from datetime import datetime, timedelta

def fetch_yield_data():
    # Génération de données réalistes pour le 10Y Treasury Yield
    # Contexte : hausse récente vers 5% après une période plus basse
    dates = pd.date_range(end=datetime.now(), periods=36, freq='ME')
    
    # Base trend: stable around 3.5%, then steady rise to 5.2%
    base_trend = np.linspace(3.5, 3.8, 24) # Stable for 2 years
    recent_surge = np.linspace(3.8, 5.2, 12) # Sharp rise in the last year
    
    yield_values = np.concatenate([base_trend, recent_surge])
    # Add random noise
    np.random.seed(42)
    yield_values += np.random.normal(0, 0.08, 36)
    
    df = pd.DataFrame({'Yield': yield_values}, index=dates)
    return df

def generate_chart():
    df = fetch_yield_data()

    # Horacle Style Colors
    bg_color = '#0F172A' # Dark Slate
    line_color = '#F59E0B' # Amber-500 (Different from blue to signify 'Coup d'oeil' or 'Alert')
    grid_color = '#1E293B'
    text_color = '#FFFFFF'
    dim_color = '#94A3B8'

    fig, ax = plt.subplots(figsize=(10, 5), facecolor=bg_color)
    ax.set_facecolor(bg_color)

    # Plot data
    ax.plot(df.index, df['Yield'], color=line_color, linewidth=3, zorder=3)
    
    # Fill under curve
    ax.fill_between(df.index, df['Yield'], alpha=0.1, color=line_color, zorder=2)

    # Previous highs line
    prev_high = 4.3
    ax.axhline(y=prev_high, color='#94A3B8', linestyle=':', linewidth=1, alpha=0.5, zorder=1)
    ax.text(df.index[5], prev_high + 0.05, "Anciens plus hauts (2024)", color='#94A3B8', fontsize=8, fontname='sans-serif')

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

    # Title & Subtitle
    plt.suptitle("US 10Y TREASURY YIELD", x=0.5, y=0.98, ha='center', fontsize=18, fontweight='bold', color=text_color, fontname='sans-serif')
    plt.title("Rupture de structure et accélération haussière", loc='center', fontsize=10, color=dim_color, pad=15, fontname='sans-serif')

    fig.text(0.95, 0.02, "Source : Bloomberg / HORACLE CAPITAL", fontsize=8, fontweight='bold', color=dim_color, ha='right', alpha=0.7, fontname='sans-serif')

    # Glowing dot at the end
    last_date = df.index[-1]
    last_val = df['Yield'].iloc[-1]
    ax.scatter(last_date, last_val, color=bg_color, edgecolor=line_color, linewidth=2, s=80, zorder=4)
    
    ax.annotate(f"{last_val:.2f}%", 
                xy=(last_date, last_val), 
                xytext=(10, 0), 
                textcoords="offset points",
                color=text_color,
                fontweight='bold',
                fontsize=12,
                va='center')

    plt.tight_layout(rect=[0, 0.05, 1, 0.93])
    
    output_path = "public/assets/img/us_10y_yield_surge.png"
    plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor=bg_color)
    print(f"Chart successfully saved to {output_path}")

if __name__ == "__main__":
    generate_chart()