import numpy as np
import matplotlib.pyplot as plt
import matplotlib.ticker as mtick

def generate_efficient_frontier():
    # Horacle Style Colors
    bg_color = '#0F172A' 
    line_color = '#2563EB' 
    dot_color = '#60A5FA'
    grid_color = '#1E293B'
    text_color = '#FFFFFF'
    dim_color = '#94A3B8'

    # 1. Generate Synthetic Portfolios (The Cloud)
    num_portfolios = 2000
    # Random Volatility between 5% and 25%
    p_vol = np.random.uniform(0.05, 0.25, num_portfolios)
    # Random Return, but constrained by a rough efficient frontier shape
    # r = sqrt(vol) * some_factor + noise
    p_ret = 0.15 * np.sqrt(p_vol - 0.04) + np.random.normal(0, 0.01, num_portfolios)
    # Clip values to keep them realistic
    p_ret = np.clip(p_ret, 0.01, 0.20)

    # 2. Generate the Efficient Frontier Curve (The Perfect Line)
    # Using a clean quadratic/square root function
    vols_curve = np.linspace(0.06, 0.25, 100)
    rets_curve = 0.32 * np.sqrt(vols_curve - 0.05) + 0.02

    # 3. Identify special points
    # MVP (Minimum Variance Portfolio)
    mvp_vol = vols_curve[0]
    mvp_ret = rets_curve[0]

    # Optimal Portfolio (Tangency) - Let's pick a middle point
    opt_idx = 40
    opt_vol = vols_curve[opt_idx]
    opt_ret = rets_curve[opt_idx]

    # Plotting
    fig, ax = plt.subplots(figsize=(10, 7), facecolor=bg_color)
    ax.set_facecolor(bg_color)

    # Plot the cloud of portfolios
    ax.scatter(p_vol, p_ret, c=dot_color, alpha=0.15, s=15, label='Portefeuilles simulés', zorder=2)

    # Plot the Efficient Frontier Line
    ax.plot(vols_curve, rets_curve, color=line_color, linewidth=4, label='Frontière Efficiente', zorder=3)
    
    # Add a subtle glow to the line
    for i in range(1, 4):
        ax.plot(vols_curve, rets_curve, color=line_color, linewidth=4 + i*2, alpha=0.1, zorder=3)

    # Highlight Optimal Portfolio
    ax.scatter(opt_vol, opt_ret, color=text_color, edgecolor=line_color, linewidth=2, s=150, zorder=5, label='Allocation Optimale')
    
    # Annotation for Optimal Portfolio
    ax.annotate('ALLOCATION OPTIMALE\n(Ratio de Sharpe Max)', 
                xy=(opt_vol, opt_ret), 
                xytext=(30, 40), 
                textcoords="offset points",
                color=text_color,
                fontweight='bold',
                fontsize=10,
                arrowprops=dict(arrowstyle="->", color=text_color, connectionstyle="arc3,rad=.2"),
                zorder=6)

    # Highlight MVP
    ax.scatter(mvp_vol, mvp_ret, color=dim_color, s=80, zorder=4, label='Min. Variance')

    # Formatting
    ax.set_xlabel('RISQUE (VOLATILITÉ ANNUELLE)', color=dim_color, fontsize=10, fontweight='bold', labelpad=15)
    ax.set_ylabel('RENDEMENT ESPÉRÉ', color=dim_color, fontsize=10, fontweight='bold', labelpad=15)
    
    ax.xaxis.set_major_formatter(mtick.PercentFormatter(1.0))
    ax.yaxis.set_major_formatter(mtick.PercentFormatter(1.0))

    # Spines
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color(grid_color)
    ax.spines['bottom'].set_color(grid_color)

    # Grid
    ax.grid(True, color=grid_color, linestyle='--', alpha=0.3, zorder=1)

    # Ticks
    ax.tick_params(axis='both', colors=dim_color, labelsize=9)

    # Titles
    plt.suptitle("MODÈLE DE FRONTIÈRE EFFICIENTE", x=0.5, y=0.96, ha='center', fontsize=22, fontweight='bold', color=text_color)
    plt.title("Optimisation du couple Rendement / Risque (Markowitz)", loc='center', fontsize=12, color=line_color, pad=20)

    # Legend
    leg = ax.legend(loc='lower right', facecolor=bg_color, edgecolor=grid_color, fontsize=9)
    for text in leg.get_texts():
        text.set_color(dim_color)

    # Branding
    fig.text(0.95, 0.02, "Simulation : HORACLE CAPITAL / Modèle de Markowitz", fontsize=8, fontweight='bold', color=dim_color, ha='right', alpha=0.5)

    plt.tight_layout(rect=[0, 0.05, 1, 0.95])
    
    output_path = "public/assets/img/efficient_frontier_horacle.png"
    plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor=bg_color)
    print(f"Efficient Frontier chart successfully saved to {output_path}")

if __name__ == "__main__":
    generate_efficient_frontier()
