import numpy as np
import matplotlib.pyplot as plt
import matplotlib.ticker as mtick
from matplotlib.patches import Polygon

def generate_dalbar_chart():
    # Horacle Style Constants
    BG_COLOR = '#0F172A'
    BLUE_PRIMARY = '#2563EB'
    WARNING_COLOR = '#F59E0B' # Amber/Gold for the investor mistakes
    GRID_COLOR = '#1E293B'
    TEXT_COLOR = '#FFFFFF'
    DIM_COLOR = '#94A3B8'
    
    # Generate 20 years of monthly data
    months = np.arange(0, 240)
    years = months / 12
    
    # 1. Simulate Market (S&P 500)
    # Base growth + cyclicality + 2 major crashes
    base_growth = 10000 * (1.085 ** years) # ~8.5% annualized
    cycles = 1 + 0.15 * np.sin(years * 1.2) + 0.05 * np.cos(years * 3)
    
    market = base_growth * cycles
    
    # Add Crash 1 (Year 5 - e.g. 2008)
    crash1_start = 55
    crash1_end = 75
    market[crash1_start:crash1_end] *= np.linspace(1, 0.6, crash1_end - crash1_start)
    market[crash1_end:] *= 0.6 # Permanently rebase the rest
    
    # Add Crash 2 (Year 14 - e.g. 2020/Covid)
    crash2_start = 160
    crash2_end = 168
    market[crash2_start:crash2_end] *= np.linspace(1, 0.75, crash2_end - crash2_start)
    market[crash2_end:] *= 0.75 # Permanently rebase the rest

    # 2. Simulate Average Investor
    investor = np.copy(market)
    
    # Mistake 1: Panic sell at bottom of Crash 1, miss the rebound, buy back late
    sell1_idx = 70 # Sells near the bottom
    buy1_idx = 95 # Buys back much higher
    cash_val1 = investor[sell1_idx]
    # Stays in cash
    investor[sell1_idx:buy1_idx] = cash_val1
    # Buys back in, misses the growth between sell1 and buy1
    missed_growth1 = market[buy1_idx] / market[sell1_idx]
    investor[buy1_idx:] = investor[buy1_idx:] / missed_growth1

    # Mistake 2: Euphoria buy at peak before Crash 2, panic sell again
    peak2_idx = 158
    sell2_idx = 166
    buy2_idx = 180
    cash_val2 = investor[sell2_idx]
    investor[sell2_idx:buy2_idx] = cash_val2
    missed_growth2 = market[buy2_idx] / market[sell2_idx]
    investor[buy2_idx:] = investor[buy2_idx:] / missed_growth2
    
    # General "friction" (trading fees, poor timing on small dips) - 1.5% drag
    investor *= (0.985 ** years)

    # Plotting
    fig, ax = plt.subplots(figsize=(12, 7), facecolor=BG_COLOR)
    ax.set_facecolor(BG_COLOR)

    # Plot Market
    ax.plot(years, market, color=BLUE_PRIMARY, linewidth=3, label="Indice S&P 500 (Buy & Hold)", zorder=3)
    
    # Plot Investor
    ax.plot(years, investor, color=WARNING_COLOR, linewidth=2.5, label="Investisseur Moyen (Émotionnel)", zorder=4)

    # Fill the "Behavioral Gap"
    ax.fill_between(years, investor, market, where=(market > investor), color=WARNING_COLOR, alpha=0.1, zorder=2)

    # Annotations
    # Panic Sell 1
    ax.annotate("VENTE DE PANIQUE\n(Marché au plus bas)", 
                xy=(years[sell1_idx], investor[sell1_idx]), 
                xytext=(years[sell1_idx]-2, investor[sell1_idx]-8000),
                color=WARNING_COLOR, fontweight='bold', fontsize=10, ha='center',
                arrowprops=dict(arrowstyle="->", color=WARNING_COLOR, lw=1.5), zorder=5)

    # FOMO Buy
    ax.annotate("ACHAT D'EUPHORIE\n(FOMO au sommet)", 
                xy=(years[peak2_idx], investor[peak2_idx]), 
                xytext=(years[peak2_idx]-3, investor[peak2_idx]+8000),
                color=WARNING_COLOR, fontweight='bold', fontsize=10, ha='right',
                arrowprops=dict(arrowstyle="->", color=WARNING_COLOR, lw=1.5), zorder=5)

    # Gap Annotation at the end
    end_market = market[-1]
    end_investor = investor[-1]
    ax.annotate(f"LE « BEHAVIORAL GAP »\n(Sous-performance de 3 à 5% / an)", 
                xy=(years[-1], (end_market + end_investor)/2), 
                xytext=(years[-1]-6, (end_market + end_investor)/2),
                color=TEXT_COLOR, fontweight='bold', fontsize=11, ha='right', va='center',
                bbox=dict(boxstyle="round,pad=0.5", fc='#1E293B', ec=DIM_COLOR, alpha=0.8),
                arrowprops=dict(arrowstyle="-|>", color=TEXT_COLOR, lw=1.5), zorder=5)

    # End dots
    ax.scatter(years[-1], end_market, color=BLUE_PRIMARY, s=60, zorder=5)
    ax.scatter(years[-1], end_investor, color=WARNING_COLOR, s=60, zorder=5)
    
    # End Labels
    ax.text(years[-1]+0.3, end_market, f"{int(end_market):,} €", color=BLUE_PRIMARY, fontweight='bold', va='center')
    ax.text(years[-1]+0.3, end_investor, f"{int(end_investor):,} €", color=WARNING_COLOR, fontweight='bold', va='center')

    # Formatting
    ax.set_xlabel('ANNÉES', color=DIM_COLOR, fontsize=10, fontweight='bold', labelpad=15)
    ax.set_ylabel('VALEUR DU PORTEFEUILLE (Base 10 000€)', color=DIM_COLOR, fontsize=10, fontweight='bold', labelpad=15)
    
    # Y-axis as currency
    fmt = '{x:,.0f} €'
    tick = mtick.StrMethodFormatter(fmt)
    ax.yaxis.set_major_formatter(tick)
    
    ax.set_xlim(0, 21)
    ax.set_ylim(0, max(market)*1.1)

    # Spines
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color(GRID_COLOR)
    ax.spines['bottom'].set_color(GRID_COLOR)

    # Grid
    ax.grid(True, axis='y', color=GRID_COLOR, linestyle='--', alpha=0.5, zorder=1)

    # Ticks
    ax.tick_params(axis='both', colors=DIM_COLOR, labelsize=10)

    # Titles
    plt.suptitle("LE PIÈGE ÉMOTIONNEL (ÉTUDE DALBAR)", x=0.5, y=0.96, ha='center', fontsize=22, fontweight='bold', color=TEXT_COLOR)
    plt.title("Pourquoi l'investisseur moyen sous-performe l'indice de référence sur le long terme", loc='center', fontsize=12, color=BLUE_PRIMARY, pad=20)

    # Legend
    leg = ax.legend(loc='upper left', facecolor=BG_COLOR, edgecolor=GRID_COLOR, fontsize=11, framealpha=0.9)
    for text in leg.get_texts():
        text.set_color(TEXT_COLOR)

    # Branding
    fig.text(0.95, 0.02, "Simulation Conceptuelle d'après le Rapport Dalbar QAIB / HORACLE CAPITAL", fontsize=8, fontweight='bold', color=DIM_COLOR, ha='right', alpha=0.5)

    plt.tight_layout(rect=[0, 0.05, 0.95, 0.95])
    
    output_path = "public/assets/img/visuals/dalbar_behavioral_gap.png"
    plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor=BG_COLOR)
    print(f"Chart successfully saved to {output_path}")

if __name__ == "__main__":
    generate_dalbar_chart()
