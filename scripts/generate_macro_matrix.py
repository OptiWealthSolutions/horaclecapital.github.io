import matplotlib.pyplot as plt
import matplotlib.patches as patches

def generate_macro_matrix():
    # Horacle Style Constants
    BG_COLOR = '#0F172A'
    TEXT_COLOR = '#FFFFFF'
    DIM_COLOR = '#94A3B8'
    
    # Colors for the quadrants
    Q_COLORS = {
        'TL': '#1E3A8A', # Reflation (Blue)
        'TR': '#991B1B', # Overheat (Red/Orange)
        'BL': '#374151', # Deflation (Grey)
        'BR': '#854D0E'  # Stagflation (Gold/Brown)
    }

    fig, ax = plt.subplots(figsize=(12, 10), facecolor=BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    
    # Define axes limits
    ax.set_xlim(-10, 10)
    ax.set_ylim(-10, 10)
    
    # 1. Draw Quadrants with subtle background colors
    ax.add_patch(patches.Rectangle((-10, 0), 10, 10, facecolor=Q_COLORS['TL'], alpha=0.15))
    ax.add_patch(patches.Rectangle((0, 0), 10, 10, facecolor=Q_COLORS['TR'], alpha=0.15))
    ax.add_patch(patches.Rectangle((-10, -10), 10, 10, facecolor=Q_COLORS['BL'], alpha=0.15))
    ax.add_patch(patches.Rectangle((0, -10), 10, 10, facecolor=Q_COLORS['BR'], alpha=0.15))

    # 2. Draw Central Axes (Arrows)
    ax.annotate('', xy=(9.5, 0), xytext=(-9.5, 0), arrowprops=dict(arrowstyle="<->", color=DIM_COLOR, lw=2))
    ax.annotate('', xy=(0, 9.5), xytext=(0, -9.5), arrowprops=dict(arrowstyle="<->", color=DIM_COLOR, lw=2))
    
    # Axes Labels
    ax.text(9.5, -0.5, "INFLATION HAUSSIÈRE", color=DIM_COLOR, fontsize=12, fontweight='bold', ha='right', va='top')
    ax.text(-9.5, -0.5, "INFLATION BAISSIÈRE", color=DIM_COLOR, fontsize=12, fontweight='bold', ha='left', va='top')
    ax.text(0.5, 9.5, "CROISSANCE\nHAUSSIÈRE", color=DIM_COLOR, fontsize=12, fontweight='bold', ha='left', va='top')
    ax.text(0.5, -9.5, "CROISSANCE\nBAISSIÈRE", color=DIM_COLOR, fontsize=12, fontweight='bold', ha='left', va='bottom')

    # 3. Populate Quadrants
    
    # Top-Left: Goldilocks / Reflation
    ax.text(-5, 7.5, "REFLATION", color='#60A5FA', fontsize=18, fontweight='bold', ha='center')
    ax.text(-5, 6, "Croissance forte, Prix stables", color=DIM_COLOR, fontsize=11, ha='center', style='italic')
    ax.text(-5, 3.5, "ACTIONS (Croissance, Tech)\nOBLIGATIONS D'ENTREPRISE", color=TEXT_COLOR, fontsize=13, fontweight='bold', ha='center', 
            bbox=dict(facecolor=BG_COLOR, edgecolor='#60A5FA', boxstyle='round,pad=1', alpha=0.8))

    # Bottom-Left: Deflation
    ax.text(-5, -3.5, "RÉCESSION", color='#94A3B8', fontsize=18, fontweight='bold', ha='center')
    ax.text(-5, -5, "Croissance faible, Prix en baisse", color=DIM_COLOR, fontsize=11, ha='center', style='italic')
    ax.text(-5, -7.5, "OBLIGATIONS D'ÉTAT (T-Bonds)\nCASH & OR (Refuge)", color=TEXT_COLOR, fontsize=13, fontweight='bold', ha='center', 
            bbox=dict(facecolor=BG_COLOR, edgecolor='#94A3B8', boxstyle='round,pad=1', alpha=0.8))

    # Top-Right: Overheat
    ax.text(5, 7.5, "SURCHAUFFE", color='#F87171', fontsize=18, fontweight='bold', ha='center')
    ax.text(5, 6, "Croissance forte, Prix en hausse", color=DIM_COLOR, fontsize=11, ha='center', style='italic')
    ax.text(5, 3.5, "MATIÈRES PREMIÈRES (Énergie, Cuivre)\nACTIONS (Valeur, Banques)", color=TEXT_COLOR, fontsize=13, fontweight='bold', ha='center', 
            bbox=dict(facecolor=BG_COLOR, edgecolor='#F87171', boxstyle='round,pad=1', alpha=0.8))

    # Bottom-Right: Stagflation (The key area for Commodities/Gold in the guide)
    ax.text(5, -3.5, "STAGFLATION", color='#FBBF24', fontsize=18, fontweight='bold', ha='center')
    ax.text(5, -5, "Croissance faible, Prix en hausse", color=DIM_COLOR, fontsize=11, ha='center', style='italic')
    ax.text(5, -7.5, "OR (Protection absolue)\nMATIÈRES PREMIÈRES DIVERSIFIÉES", color=TEXT_COLOR, fontsize=13, fontweight='bold', ha='center', 
            bbox=dict(facecolor=BG_COLOR, edgecolor='#FBBF24', boxstyle='round,pad=1', alpha=0.8, lw=2))

    # Highlight box for the Stagflation/Overheat commodity logic
    ax.annotate("Pourquoi les Matières Premières ?\nElles sont le seul actif qui performe\nquand l'inflation détruit les actions et obligations.",
                xy=(5, 1.5), xycoords='data',
                xytext=(5, 0.5), textcoords='data',
                ha="center", va="center", color='#FBBF24', fontsize=11, style='italic',
                bbox=dict(boxstyle="round4,pad=0.8", fc=BG_COLOR, ec='#FBBF24', lw=1, alpha=0.9),
                arrowprops=dict(arrowstyle="-|>", connectionstyle="arc3,rad=-0.2", color='#FBBF24'))

    # Formatting
    ax.axis('off')
    
    # Titles
    plt.suptitle("MATRICE DES RÉGIMES MACROÉCONOMIQUES", x=0.5, y=0.96, ha='center', fontsize=22, fontweight='bold', color=TEXT_COLOR)
    plt.title("Le rôle stratégique des matières premières selon les cycles de croissance et d'inflation", loc='center', fontsize=13, color='#60A5FA', pad=20)

    # Branding
    fig.text(0.95, 0.02, "Modèle Inspiré du 'Investment Clock' / HORACLE CAPITAL", fontsize=9, fontweight='bold', color=DIM_COLOR, ha='right', alpha=0.6)

    plt.tight_layout(rect=[0, 0.05, 1, 0.95])
    
    output_path = "public/assets/img/visuals/macro_regime_matrix.png"
    plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor=BG_COLOR)
    print(f"Chart successfully saved to {output_path}")

if __name__ == "__main__":
    generate_macro_matrix()
