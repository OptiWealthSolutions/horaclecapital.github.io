import matplotlib.pyplot as plt
import numpy as np

def generate_quant_weighting():
    # Horacle Style Constants
    BG_COLOR = '#0F172A'
    TEXT_COLOR = '#FFFFFF'
    DIM_COLOR = '#94A3B8'
    GRID_COLOR = '#1E293B'
    
    # Asset colors representing different risk/return profiles
    COLORS = ['#334155', '#38BDF8', '#2563EB', '#F59E0B']
    ASSET_NAMES = ['A. T-Bonds\n(Low Risk)', 'B. Value\n(Med Risk)', 'C. Growth\n(High Risk)', 'D. Crypto/Gold\n(Uncorrelated)']
    
    # Methods
    methods = [
        "Équipondération\n(1/N Naïf)", 
        "Market Cap\n(Indice Classique)", 
        "Minimum Variance\n(MinVol)", 
        "Risk Parity\n(ERC)"
    ]
    
    # Weights for each method (Columns are Methods, Rows are Assets)
    # 1. Equal: 25% each
    # 2. Market Cap: Growth usually dominates, Bonds small in equities index
    # 3. Min Vol: Heavily weights the lowest risk (Bonds)
    # 4. Risk Parity: Balances risk contribution (more to low volatility)
    weights = np.array([
        [25,  5, 60, 40], # T-Bonds
        [25, 20, 25, 30], # Value
        [25, 65, 10, 15], # Growth
        [25, 10,  5, 15], # Crypto/Gold
    ])

    fig, ax = plt.subplots(figsize=(12, 7), facecolor=BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    
    # Create stacked bar chart
    bottom = np.zeros(4)
    
    for i in range(4):
        bars = ax.bar(methods, weights[i], bottom=bottom, color=COLORS[i], edgecolor=BG_COLOR, linewidth=2, label=ASSET_NAMES[i], alpha=0.9)
        bottom += weights[i]
        
        # Add text labels inside bars if large enough
        for j, rect in enumerate(bars):
            h = rect.get_height()
            if h > 8:
                ax.text(rect.get_x() + rect.get_width()/2., rect.get_y() + h/2.,
                        f'{int(h)}%', ha='center', va='center', color='white', fontweight='bold', fontsize=10)

    # Formatting
    ax.set_ylabel('PONDÉRATION DU PORTEFEUILLE (%)', color=DIM_COLOR, fontsize=10, fontweight='bold', labelpad=15)
    ax.tick_params(axis='x', colors=TEXT_COLOR, labelsize=11)
    ax.tick_params(axis='y', colors=DIM_COLOR, labelsize=10)
    
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color(GRID_COLOR)
    ax.spines['bottom'].set_color(GRID_COLOR)
    
    ax.set_ylim(0, 100)
    
    # Legend
    leg = ax.legend(loc='upper center', bbox_to_anchor=(0.5, -0.15), ncol=4, frameon=False, fontsize=10)
    for text in leg.get_texts():
        text.set_color(DIM_COLOR)
        
    # Titles
    plt.suptitle("MODÈLES D'ALLOCATION QUANTITATIVE", x=0.5, y=0.98, ha='center', fontsize=22, fontweight='bold', color=TEXT_COLOR)
    plt.title("Comparaison des méthodologies de pondération selon les profils de risque", loc='center', fontsize=12, color='#60A5FA', pad=20)

    plt.tight_layout(rect=[0, 0, 1, 0.95])
    
    output_path = "public/assets/img/visuals/quant_weighting_methods.png"
    plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor=BG_COLOR)
    print(f"Chart successfully saved to {output_path}")

if __name__ == "__main__":
    generate_quant_weighting()
