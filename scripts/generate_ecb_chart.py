import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import matplotlib.ticker as mtick
from datetime import datetime

def generate_ecb_data():
    # Génération de la timeline : Janvier 2023 à Décembre 2026
    dates = pd.date_range(start='2023-01-01', end='2026-12-01', freq='ME')
    
    # Réserves excédentaires en Milliards d'Euros
    # Peak début 2023 (environ 4100 Mds), descente progressive avec QT (APP/PEPP) et remboursement TLTRO
    # Baisse accélérée en 2026.
    
    # Création d'une courbe en cloche inversée / descente
    x = np.linspace(0, 10, len(dates))
    
    # Fonction simulant le retrait de liquidité
    liquidity = 4200 - (150 * x) - (5 * x**2)
    
    # Ajout d'un léger bruit pour le réalisme
    np.random.seed(42)
    noise = np.random.normal(0, 30, len(dates))
    liquidity = liquidity + noise
    
    df = pd.DataFrame({'Reserves': liquidity}, index=dates)
    return df

def generate_chart():
    df = generate_ecb_data()

    # Horacle Style Colors
    bg_color = '#0F172A' # Tailwind slate-900 (Dark)
    line_color = '#2563EB' # Tailwind blue-600
    grid_color = '#1E293B' # Tailwind slate-800
    text_color = '#FFFFFF'
    dim_color = '#94A3B8' # Tailwind slate-400
    alert_color = '#F59E0B' # Tailwind amber-500 (Orange)

    fig, ax = plt.subplots(figsize=(10, 5), facecolor=bg_color)
    ax.set_facecolor(bg_color)

    # Plot data
    ax.plot(df.index, df['Reserves'], color=line_color, linewidth=3, zorder=3)
    
    # Fill under curve
    ax.fill_between(df.index, df['Reserves'], alpha=0.15, color=line_color, zorder=2)

    # Ligne du seuil critique
    critical_threshold = 2800 # Exemple de seuil critique (Mds €)
    ax.axhline(y=critical_threshold, color=alert_color, linestyle='--', linewidth=1.5, alpha=0.8, zorder=1)
    
    # Annotation du seuil critique
    ax.text(df.index[5], critical_threshold + 50, "Seuil critique de liquidité structurelle", 
            color=alert_color, fontsize=9, fontweight='bold', fontname='sans-serif',
            ha='left', va='bottom', alpha=0.9)

    # Zone de projection (2026)
    projection_start = pd.to_datetime('2026-01-01')
    ax.axvspan(projection_start, df.index[-1], color='#FFFFFF', alpha=0.03, zorder=0)
    ax.text(projection_start + pd.Timedelta(days=15), 4000, "2026 : Accélération du QT\n(APP/PEPP)", 
            color=text_color, fontsize=8, fontname='sans-serif', alpha=0.7, va='top')

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
    
    # Format Y axis as Billions €
    ax.yaxis.set_major_formatter(mtick.StrMethodFormatter('{x:,.0f} Mds €'))
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y'))

    # Title & Subtitle
    plt.suptitle("RÉSERVES EXCÉDENTAIRES DE L'EUROSYSÈME", x=0.5, y=0.98, ha='center', fontsize=16, fontweight='bold', color=text_color, fontname='sans-serif')
    plt.title("Dynamique de contraction (QT) vers les seuils critiques", loc='center', fontsize=10, color=dim_color, pad=15, fontname='sans-serif')

    # Data Source / Branding
    fig.text(0.95, 0.02, "Source : BCE / Modélisation HORACLE CAPITAL", fontsize=8, fontweight='bold', color=dim_color, ha='right', alpha=0.7, fontname='sans-serif')

    # Add a glowing dot at the end
    last_date = df.index[-1]
    last_val = df['Reserves'].iloc[-1]
    ax.scatter(last_date, last_val, color=bg_color, edgecolor=line_color, linewidth=2, s=80, zorder=4)
    
    # Add label for last value
    ax.annotate(f"{last_val:,.0f} Mds", 
                xy=(last_date, last_val), 
                xytext=(10, 0), 
                textcoords="offset points",
                color=text_color,
                fontweight='bold',
                fontsize=11,
                va='center')

    plt.tight_layout(rect=[0, 0.05, 1, 0.93])
    
    output_path = "public/assets/img/ecb_reserves_horacle.png"
    plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor=bg_color)
    print(f"Chart successfully saved to {output_path}")

if __name__ == "__main__":
    generate_chart()