import matplotlib.pyplot as plt

def generate_markowitz_formula():
    # Horacle Style Constants
    BG_COLOR = '#0F172A'
    TEXT_COLOR = '#FFFFFF'
    BLUE_LIGHT = '#60A5FA'
    BLUE_PRIMARY = '#2563EB'
    DIM_COLOR = '#94A3B8'
    
    fig, ax = plt.subplots(figsize=(10, 6), facecolor=BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    ax.axis('off')
    
    # Title
    plt.text(0.5, 0.95, "THÉORIE MODERNE DU PORTEFEUILLE (H. MARKOWITZ)", 
             ha='center', va='center', fontsize=20, fontweight='bold', color=TEXT_COLOR)
    plt.text(0.5, 0.88, "Optimisation du couple Rendement / Risque", 
             ha='center', va='center', fontsize=14, color=BLUE_LIGHT, style='italic')

    # Formula 1: Expected Return
    plt.text(0.1, 0.65, "1. Rendement Espéré du Portefeuille", 
             ha='left', va='center', fontsize=14, fontweight='bold', color=TEXT_COLOR)
    
    eq_return = r"$E(R_p) = \sum_{i=1}^{n} w_i E(R_i) = \mathbf{w}^T \mathbf{\mu}$"
    plt.text(0.5, 0.55, eq_return, 
             ha='center', va='center', fontsize=24, color=BLUE_LIGHT)

    # Formula 2: Portfolio Variance (Risk)
    plt.text(0.1, 0.40, "2. Risque (Variance) du Portefeuille", 
             ha='left', va='center', fontsize=14, fontweight='bold', color=TEXT_COLOR)
    
    eq_variance = r"$\sigma_p^2 = \sum_{i=1}^{n} \sum_{j=1}^{n} w_i w_j \sigma_i \sigma_j \rho_{ij} = \mathbf{w}^T \mathbf{\Sigma} \mathbf{w}$"
    plt.text(0.5, 0.28, eq_variance, 
             ha='center', va='center', fontsize=24, color=BLUE_PRIMARY)

    # Legend / Definitions
    legend_text = (
        r"$\mathbf{w}$ : Poids des actifs" + "\n" +
        r"$\mathbf{\mu}$ : Rendements espérés" + "\n" +
        r"$\mathbf{\Sigma}$ : Matrice de covariance" + "\n" +
        r"$\rho_{ij}$ : Corrélation"
    )
    
    # Box for legend
    bbox_props = dict(boxstyle="round,pad=1", facecolor='#1E293B', edgecolor=DIM_COLOR, alpha=0.5)
    plt.text(0.5, 0.08, legend_text, 
             ha='center', va='center', fontsize=12, color=DIM_COLOR, bbox=bbox_props)

    plt.tight_layout()
    
    output_path = "public/assets/img/visuals/markowitz_formula.png"
    plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor=BG_COLOR)
    print(f"Chart successfully saved to {output_path}")

if __name__ == "__main__":
    generate_markowitz_formula()
