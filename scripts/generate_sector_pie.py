import numpy as np
import matplotlib.pyplot as plt

def generate_sector_chart():
    # Horacle Style Constants
    BG_COLOR = '#0F172A'
    TEXT_COLOR = '#FFFFFF'
    DIM_COLOR = '#94A3B8'
    
    # Palette of blues and greys for the sectors
    COLORS = ['#2563EB', '#60A5FA', '#38BDF8', '#94A3B8', '#334155']

    # Sectors from the guide
    labels = ['TECHNOLOGIE', 'SANTÉ', 'ÉNERGIE', 'FINANCE', 'CONSO. DE BASE']
    
    # Generate random weights between 10 and 35
    raw_weights = np.random.uniform(10, 35, len(labels))
    
    # Normalize to exactly 100%
    weights = (raw_weights / raw_weights.sum()) * 100

    # Create figure
    fig, ax = plt.subplots(figsize=(10, 8), facecolor=BG_COLOR)
    
    # Create donut chart (pie chart with a white circle in the middle)
    wedges, texts, autotexts = ax.pie(
        weights, 
        labels=labels, 
        colors=COLORS, 
        autopct='%1.1f%%',
        startangle=90,
        pctdistance=0.85,
        textprops=dict(color=TEXT_COLOR, fontweight='bold', fontsize=12),
        wedgeprops=dict(width=0.4, edgecolor=BG_COLOR, linewidth=3) # Width creates the donut hole
    )
    
    # Format the labels outside the donut
    for text in texts:
        text.set_color(DIM_COLOR)
        text.set_fontsize(11)
        text.set_fontweight('bold')

    # Add a central text
    ax.text(0, 0, 'ALLOCATION\nSECTORIELLE\n(Diversification)', 
            ha='center', va='center', fontsize=14, fontweight='bold', color=TEXT_COLOR)

    # Titles
    plt.suptitle("RÉPARTITION SECTORIELLE DU PORTEFEUILLE", x=0.5, y=0.95, ha='center', fontsize=20, fontweight='bold', color=TEXT_COLOR)
    plt.title("Exemple de diversification selon la Règle des 5 secteurs", loc='center', fontsize=12, color=COLORS[0], pad=10)

    # Branding
    fig.text(0.95, 0.05, "Simulation : HORACLE CAPITAL", fontsize=8, fontweight='bold', color=DIM_COLOR, ha='right', alpha=0.5)

    plt.tight_layout()
    
    output_path = "public/assets/img/visuals/sector_weighting_donut.png"
    plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor=BG_COLOR)
    print(f"Chart successfully saved to {output_path}")

if __name__ == "__main__":
    generate_sector_chart()
