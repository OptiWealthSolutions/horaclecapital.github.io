import numpy as np
import matplotlib.pyplot as plt
import matplotlib.ticker as mtick
from matplotlib.patches import Circle, Wedge, Polygon, Ellipse

# Horacle Style Constants
BG_COLOR = '#0F172A'
BLUE_PRIMARY = '#2563EB'
BLUE_LIGHT = '#60A5FA'
GRID_COLOR = '#1E293B'
TEXT_COLOR = '#FFFFFF'
DIM_COLOR = '#94A3B8'

def save_fig(filename):
    path = f"public/assets/img/visuals/{filename}"
    plt.savefig(path, dpi=300, bbox_inches='tight', facecolor=BG_COLOR)
    print(f"Saved: {path}")
    plt.close()

# 1. Profiling Matrix
def gen_profiling_matrix():
    fig, ax = plt.subplots(figsize=(10, 8), facecolor=BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    
    # Zones
    ax.add_patch(plt.Rectangle((0, 0), 3, 33, color=BLUE_PRIMARY, alpha=0.05))
    ax.add_patch(plt.Rectangle((3, 33), 7, 34, color=BLUE_PRIMARY, alpha=0.1))
    ax.add_patch(plt.Rectangle((10, 67), 20, 33, color=BLUE_PRIMARY, alpha=0.15))

    # Profiles
    profiles = [
        {'name': 'DÉFENSIF', 'x': 2, 'y': 25, 'color': DIM_COLOR},
        {'name': 'MODÉRÉ', 'x': 7, 'y': 50, 'color': BLUE_LIGHT},
        {'name': 'DYNAMIQUE', 'x': 20, 'y': 85, 'color': BLUE_PRIMARY}
    ]

    for p in profiles:
        ax.scatter(p['x'], p['y'], color=p['color'], s=500, edgecolors='white', linewidth=2, zorder=5)
        ax.annotate(p['name'], (p['x'], p['y']), xytext=(0, 20), textcoords='offset points', 
                    color='white', fontweight='bold', ha='center', fontsize=12)

    ax.set_xlabel('HORIZON DE TEMPS (ANNÉES)', color=DIM_COLOR, fontweight='bold', labelpad=20)
    ax.set_ylabel('ALLOCATION ACTIONS (%)', color=DIM_COLOR, fontweight='bold', labelpad=20)
    ax.set_xlim(0, 30)
    ax.set_ylim(0, 100)
    ax.grid(True, color=GRID_COLOR, linestyle='--', alpha=0.3)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.tick_params(colors=DIM_COLOR)
    plt.title("MATRICE DE PROFILAGE INVESTISSEUR", color='white', fontsize=18, fontweight='bold', pad=30)
    save_fig('matrix_profiling.png')

# 2. SPIVA (Haystack)
def gen_spiva_chart():
    fig, ax = plt.subplots(figsize=(10, 6), facecolor=BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    
    categories = ['S&P 500 (15 ans)', 'Europe (10 ans)', 'Global (10 ans)']
    underperform_rates = [92, 85, 88]

    bars = ax.barh(categories, underperform_rates, color=BLUE_PRIMARY, height=0.6, alpha=0.8)
    ax.barh(categories, [100]*3, color=GRID_COLOR, height=0.6, zorder=0) # Background bar

    for bar in bars:
        width = bar.get_width()
        ax.text(width - 8, bar.get_y() + bar.get_height()/2, f'{width}%', 
                va='center', color='white', fontweight='bold', fontsize=14)

    ax.set_xlim(0, 100)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_visible(False)
    ax.tick_params(axis='y', colors='white', labelsize=12)
    ax.tick_params(axis='x', colors=DIM_COLOR)
    plt.title("TAUX D'ÉCHEC DES GÉRANTS ACTIFS (VS INDICE)", color='white', fontsize=18, fontweight='bold', pad=30)
    ax.xaxis.set_major_formatter(mtick.PercentFormatter())
    save_fig('spiva_haystack.png')

# 3. Stock Picking Funnel
def gen_funnel():
    fig, ax = plt.subplots(figsize=(10, 8), facecolor=BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    
    # Funnel Shape (simplified as trapezoids)
    steps = [
        "BUSINESS MODEL\n(Compréhension)",
        "FOSSÉ CONCURRENTIEL\n(Moat)",
        "VALORISATION\n(P/E & PEG)",
        "BILAN & DETTE\n(Solvabilité)"
    ]
    
    widths = [0.8, 0.6, 0.4, 0.2]
    heights = [0.8, 0.6, 0.4, 0.2]
    
    for i, (step, w) in enumerate(zip(steps, widths)):
        y = 4 - i
        color = BLUE_PRIMARY if i % 2 == 0 else BLUE_LIGHT
        rect = plt.Rectangle((0.5 - w/2, y), w, 0.8, color=color, alpha=0.8 - i*0.15)
        ax.add_patch(rect)
        ax.text(0.5, y + 0.4, step, ha='center', va='center', color='white', fontweight='bold', fontsize=11)

    ax.set_xlim(0, 1)
    ax.set_ylim(0.5, 5)
    ax.axis('off')
    plt.title("L'ENTONNOIR DE SÉLECTION (STOCK PICKING)", color='white', fontsize=18, fontweight='bold', pad=20)
    save_fig('funnel_stock_picking.png')

# 5. DCA vs Lump Sum
def gen_dca_sim():
    fig, ax = plt.subplots(figsize=(10, 6), facecolor=BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    
    x = np.linspace(0, 24, 100)
    # Volatile market
    market = 100 + 15 * np.sin(x/2) + 5 * np.sin(x) + 0.5 * x
    
    # Lump Sum: Bought at x=2 (Peak)
    lump_sum = market / market[8] * 100
    
    # DCA: Average cost
    dca_avg = [np.mean(market[:i+1]) for i in range(len(market))]
    dca_perf = market / dca_avg * 100

    ax.plot(x, lump_sum, color=DIM_COLOR, alpha=0.5, label='Lump Sum (Investissement unique)')
    ax.plot(x, dca_perf, color=BLUE_PRIMARY, linewidth=3, label='DCA (Investissement lissé)')
    
    ax.fill_between(x, dca_perf, lump_sum, where=(dca_perf > lump_sum), color=BLUE_PRIMARY, alpha=0.1)

    ax.set_xlabel('MOIS', color=DIM_COLOR, fontweight='bold')
    ax.set_ylabel('VALEUR DU PORTEFEUILLE', color=DIM_COLOR, fontweight='bold')
    ax.legend(facecolor=BG_COLOR, edgecolor=GRID_COLOR, labelcolor='white')
    ax.grid(True, color=GRID_COLOR, linestyle='--', alpha=0.3)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.tick_params(colors=DIM_COLOR)
    plt.title("DCA VS LUMP SUM : RÉDUCTION DE LA VOLATILITÉ", color='white', fontsize=18, fontweight='bold', pad=30)
    save_fig('dca_vs_lumpsum.png')

# 6. Core Satellite
def gen_core_satellite():
    fig, ax = plt.subplots(figsize=(10, 10), facecolor=BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    
    # Core
    core = Circle((0.5, 0.5), 0.25, color=BLUE_PRIMARY, alpha=0.9, zorder=2)
    ax.add_patch(core)
    ax.text(0.5, 0.5, "CORE\n80%\n(ETF World)", ha='center', va='center', color='white', fontweight='bold', fontsize=16)

    # Satellites
    satellites = [
        (0.8, 0.8, "OR"),
        (0.2, 0.8, "TECH"),
        (0.5, 0.15, "EMERGING"),
        (0.8, 0.2, "ENERGY")
    ]

    for x, y, label in satellites:
        # Orbit line
        orbit = Circle((0.5, 0.5), np.sqrt((x-0.5)**2 + (y-0.5)**2), fill=False, color=GRID_COLOR, linestyle='--', alpha=0.5)
        ax.add_patch(orbit)
        
        sat = Circle((x, y), 0.08, color=BLUE_LIGHT, alpha=0.6, zorder=3)
        ax.add_patch(sat)
        ax.text(x, y, label, ha='center', va='center', color='white', fontweight='bold', fontsize=10)

    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    plt.title("STRATÉGIE CORE / SATELLITE", color='white', fontsize=22, fontweight='bold', pad=0)
    save_fig('core_satellite.png')

# 7. Liquidity Shield
def gen_liquidity_shield():
    fig, ax = plt.subplots(figsize=(10, 8), facecolor=BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    
    # Pyramid
    pts = np.array([[0.5, 0.9], [0.1, 0.1], [0.9, 0.1]])
    pyramid = Polygon(pts, color=BLUE_PRIMARY, alpha=0.1, edgecolor=BLUE_PRIMARY, linewidth=2)
    ax.add_patch(pyramid)
    
    # Levels
    levels = [
        (0.5, 0.7, "ACTIONS / CRYPTO\n(Croissance)", 0.2),
        (0.5, 0.4, "ETF / OBLIGATIONS\n(Socle)", 0.4),
        (0.5, 0.15, "ÉPARGNE DE PRÉCAUTION\n(Bouclier 3-6 mois)", 0.7)
    ]
    
    for x, y, txt, w in levels:
        ax.text(x, y, txt, ha='center', va='center', color='white', fontweight='bold', fontsize=12)
        ax.add_line(plt.Line2D([0.5-w/2, 0.5+w/2], [y-0.05, y-0.05], color=BLUE_LIGHT, alpha=0.3))

    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    plt.title("LA PYRAMIDE DE LA SÉCURITÉ FINANCIÈRE", color='white', fontsize=18, fontweight='bold', pad=20)
    save_fig('liquidity_shield.png')

# 4. Commodity Compass
def gen_commodity_compass():
    fig = plt.figure(figsize=(10, 10), facecolor=BG_COLOR)
    ax = fig.add_subplot(111, polar=True)
    ax.set_facecolor(BG_COLOR)
    
    labels = ['OR (Refuge)', 'PÉTROLE (Cyclique)', 'CUIVRE (Industrie)', 'AGRICULTURE', 'GAZ']
    values = [90, 70, 80, 60, 75]
    
    angles = np.linspace(0, 2*np.pi, len(labels), endpoint=False).tolist()
    values += values[:1]
    angles += angles[:1]
    
    ax.plot(angles, values, color=BLUE_PRIMARY, linewidth=3)
    ax.fill(angles, values, color=BLUE_PRIMARY, alpha=0.2)
    
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(labels, color=TEXT_COLOR, fontsize=12, fontweight='bold')
    ax.set_yticklabels([])
    ax.grid(color=GRID_COLOR, linestyle='--')
    plt.title("BOUSSOLE DES MATIÈRES PREMIÈRES", color='white', fontsize=20, fontweight='bold', pad=40)
    save_fig('commodity_compass.png')

# 8. Decision Tree (Simplified logic visualization)
def gen_platform_tree():
    fig, ax = plt.subplots(figsize=(12, 8), facecolor=BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    
    boxes = [
        (0.5, 0.9, "Besoin d'un PEA (France) ?"),
        (0.25, 0.6, "Boursorama / Fortuneo\n(Fiscalité Optimisée)"),
        (0.75, 0.6, "Compte-Titres (CTO)"),
        (0.6, 0.3, "Débutant ?\nTrade Republic"),
        (0.9, 0.3, "Confirmé ?\nIBKR / Degiro")
    ]
    
    for x, y, txt in boxes:
        ax.text(x, y, txt, ha='center', va='center', color='white', fontweight='bold', 
                bbox=dict(boxstyle="round,pad=1", fc=BLUE_PRIMARY, alpha=0.2, ec=BLUE_PRIMARY))

    # Connectors
    ax.annotate("", xy=(0.3, 0.65), xytext=(0.45, 0.85), arrowprops=dict(arrowstyle="->", color=BLUE_LIGHT))
    ax.annotate("", xy=(0.7, 0.65), xytext=(0.55, 0.85), arrowprops=dict(arrowstyle="->", color=BLUE_LIGHT))
    ax.annotate("", xy=(0.65, 0.35), xytext=(0.75, 0.55), arrowprops=dict(arrowstyle="->", color=BLUE_LIGHT))
    ax.annotate("", xy=(0.85, 0.35), xytext=(0.75, 0.55), arrowprops=dict(arrowstyle="->", color=BLUE_LIGHT))

    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    plt.title("ARBRE DE DÉCISION : CHOIX DE LA PLATEFORME", color='white', fontsize=18, fontweight='bold', pad=20)
    save_fig('platform_decision_tree.png')

if __name__ == "__main__":
    import os
    os.makedirs("public/assets/img/visuals", exist_ok=True)
    
    gen_profiling_matrix()
    gen_spiva_chart()
    gen_funnel()
    gen_commodity_compass()
    gen_dca_sim()
    gen_core_satellite()
    gen_liquidity_shield()
    gen_platform_tree()
