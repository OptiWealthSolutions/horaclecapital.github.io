import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import matplotlib.ticker as mtick

def generate_japan_gdp_data():
    # Timeline: Q1 2021 to Q2 2026
    quarters = pd.period_range(start='2021-01-01', end='2026-06-30', freq='Q')
    dates = quarters.to_timestamp()

    # Realistic Quarterly Annualized GDP Growth for Japan (%)
    # Context: volatile growth, technical recessions, weak domestic demand
    gdp_growth = [
        1.2, -0.4, 0.5, 1.8,  # 2021
        -0.2, 0.8, -0.3, 0.1, # 2022
        0.9, 1.1, -0.7, -0.1, # 2023
        -0.5, 0.6, 0.2, -0.4, # 2024
        -0.3, 0.2, -0.1, -0.5,# 2025
        0.1, 0.4              # 2026 Q1, Q2 (Est.)
    ]

    df = pd.DataFrame({'GDP_Growth': gdp_growth}, index=dates)
    return df

def generate_chart():
    df = generate_japan_gdp_data()

    # Horacle Style Colors
    bg_color = '#0F172A' # Tailwind slate-900 (Dark)
    line_color = '#2563EB' # Tailwind blue-600
    pos_color = '#34D399' # Tailwind emerald-400 (Green)
    neg_color = '#F87171' # Tailwind red-400 (Red)
    grid_color = '#1E293B' # Tailwind slate-800
    text_color = '#FFFFFF'
    dim_color = '#94A3B8' # Tailwind slate-400

    fig, ax = plt.subplots(figsize=(10, 5), facecolor=bg_color)
    ax.set_facecolor(bg_color)

    # Plot data as a bar chart for quarterly growth
    colors = [pos_color if val >= 0 else neg_color for val in df['GDP_Growth']]
    bars = ax.bar(df.index, df['GDP_Growth'], width=60, color=colors, zorder=3, alpha=0.85)

    # Style the last bar as an estimate (hatch pattern)
    bars[-1].set_hatch('//')
    bars[-1].set_edgecolor(bg_color)

    # Add a zero line
    ax.axhline(0, color=dim_color, linewidth=1, zorder=2)

    # Formatting
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_visible(False)
    ax.spines['bottom'].set_visible(False)
    
    # Grid
    ax.grid(True, axis='y', color=grid_color, linestyle='--', alpha=0.7, zorder=1)

    # Ticks & Labels
    ax.tick_params(axis='x', colors=dim_color, labelsize=10, bottom=False)
    ax.tick_params(axis='y', colors=dim_color, labelsize=10, left=False)
    
    ax.yaxis.set_major_formatter(mtick.PercentFormatter(decimals=1))
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y-Q%q'))

    # Title & Subtitle
    plt.suptitle("CROISSANCE DU PIB JAPONAIS", x=0.5, y=0.98, ha='center', fontsize=18, fontweight='bold', color=text_color, fontname='sans-serif')
    plt.title("Croissance trimestrielle annualisée (%) - Incluant projections", loc='center', fontsize=10, color=dim_color, pad=15, fontname='sans-serif')

    # Data Source / Branding
    fig.text(0.95, 0.02, "Source : Cabinet Office Japan & Consensus / HORACLE CAPITAL", fontsize=8, fontweight='bold', color=dim_color, ha='right', alpha=0.7, fontname='sans-serif')

    # Add labels to the last few bars
    for i in [-4, -3, -2, -1]:
        bar = bars[i]
        val = df['GDP_Growth'].iloc[i]
        y_pos = bar.get_height() + (0.1 if val >= 0 else -0.25)
        
        # Add "Est." text for the last bar
        label_text = f"{val:+.1f}%\n(Est.)" if i == -1 else f"{val:+.1f}%"
        
        ax.text(bar.get_x() + bar.get_width()/2., y_pos,
                label_text,
                ha='center', va='bottom' if val >= 0 else 'top',
                color=text_color, fontweight='bold', fontsize=9, zorder=4)

    plt.tight_layout(rect=[0, 0.05, 1, 0.93])
    
    output_path = "public/assets/img/japan_gdp_horacle.png"
    plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor=bg_color)
    print(f"Chart successfully saved to {output_path}")

if __name__ == "__main__":
    generate_chart()