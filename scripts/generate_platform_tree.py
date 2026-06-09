import matplotlib.pyplot as plt
import matplotlib.patches as patches

def generate_platform_tree():
    # Horacle Style Constants
    BG_COLOR = '#0F172A'
    BLUE_PRIMARY = '#2563EB'
    BLUE_LIGHT = '#60A5FA'
    TEXT_COLOR = '#FFFFFF'
    DIM_COLOR = '#94A3B8'
    
    fig, ax = plt.subplots(figsize=(14, 10), facecolor=BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    
    # Helper to draw boxes
    def draw_box(x, y, w, h, text, is_decision=False, bg_color=BLUE_PRIMARY, text_size=12):
        box_style = "round,pad=0.5" if not is_decision else "darrow,pad=0.3"
        box = patches.FancyBboxPatch((x - w/2, y - h/2), w, h, boxstyle=box_style, 
                                     linewidth=1.5, edgecolor=BLUE_LIGHT, facecolor=bg_color, alpha=0.9)
        ax.add_patch(box)
        ax.text(x, y, text, ha='center', va='center', color=TEXT_COLOR, fontsize=text_size, fontweight='bold')
        return x, y - h/2, x, y + h/2, x - w/2, x + w/2 # Bottom, Top, Left, Right coords

    # Helper to draw arrows with labels
    def draw_arrow(x1, y1, x2, y2, label="", label_pos=(0.5, 0.5)):
        ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(arrowstyle="->", color=DIM_COLOR, lw=2, shrinkA=5, shrinkB=5))
        if label:
            mx = x1 + (x2 - x1) * label_pos[0]
            my = y1 + (y2 - y1) * label_pos[1]
            ax.text(mx, my, label, ha='center', va='center', color=BLUE_LIGHT, 
                    fontsize=11, fontweight='bold', bbox=dict(facecolor=BG_COLOR, edgecolor='none', pad=2))

    # --- Nodes ---
    
    # Start: Tax Envelopes
    _, b_start, _, _, _, _ = draw_box(50, 85, 40, 10, "1. STRATÉGIE FISCALE\nCherchez-vous une optimisation fiscale en France ?", is_decision=True, bg_color='#1E3A8A')
    
    # Yes -> PEA
    _, b_pea, _, _, _, r_pea = draw_box(25, 60, 30, 10, "OUVERTURE D'UN P.E.A\n(Plan d'Épargne en Actions)", bg_color='#1E293B')
    _, _, _, _, _, _ = draw_box(25, 40, 30, 12, "Recommandations :\n• Boursorama\n• Fortuneo", bg_color=BLUE_PRIMARY, text_size=11)
    
    # No -> CTO
    _, b_cto, _, _, _, _ = draw_box(75, 60, 30, 10, "COMPTE TITRES ORDINAIRE\n(C.T.O / Marchés Internationaux)", bg_color='#1E293B')
    
    # Decision: Experience Level (under CTO)
    _, b_exp, _, _, l_exp, r_exp = draw_box(75, 40, 35, 10, "2. EXPÉRIENCE & BESOINS\nQuel est votre profil d'investisseur ?", is_decision=True, bg_color='#1E3A8A')
    
    # Beginner -> Trade Republic
    _, _, _, _, _, _ = draw_box(55, 15, 25, 12, "DÉBUTANT\nInterface Simple / DCA\n\n▶ Trade Republic", bg_color=BLUE_PRIMARY, text_size=11)
    
    # Advanced -> IBKR
    _, _, _, _, _, _ = draw_box(95, 15, 25, 12, "CONFIRMÉ\nOutils Pro / Frais Minimes\n\n▶ Interactive Brokers", bg_color=BLUE_PRIMARY, text_size=11)
    
    # --- Connections ---
    
    # Start to Envelopes
    draw_arrow(50, 80, 25, 65, "OUI (Long Terme)", (0.4, 0.4))
    draw_arrow(50, 80, 75, 65, "NON (Flexibilité)", (0.4, 0.4))
    
    # PEA downward
    draw_arrow(25, 55, 25, 46)
    
    # CTO to Experience
    draw_arrow(75, 55, 75, 45)
    
    # Experience to Platforms
    draw_arrow(75, 35, 55, 21, "Simplicité", (0.5, 0.5))
    draw_arrow(75, 35, 95, 21, "Options Avancées", (0.5, 0.5))

    # Formatting
    ax.axis('off')
    
    # Titles
    plt.suptitle("ARBRE DE DÉCISION : CHOISIR SON COURTIER", x=0.5, y=0.98, ha='center', fontsize=24, fontweight='bold', color=TEXT_COLOR)
    plt.title("Méthodologie simplifiée pour sélectionner la plateforme adaptée à votre stratégie", loc='center', fontsize=14, color=BLUE_LIGHT, pad=20)

    plt.tight_layout(rect=[0, 0, 1, 0.95])
    
    output_path = "public/assets/img/visuals/platform_decision_tree.png"
    plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor=BG_COLOR)
    print(f"Chart successfully saved to {output_path}")

if __name__ == "__main__":
    generate_platform_tree()
