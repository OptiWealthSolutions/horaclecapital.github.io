import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.ticker as mtick
from datetime import datetime, timedelta
import sys

# Configuration du style Horacle
BG_COLOR = '#0F172A'
TEXT_COLOR = '#FFFFFF'
DIM_COLOR = '#94A3B8'
GRID_COLOR = '#1E293B'
PRIMARY_COLOR = '#2563EB'  # Blue
DANGER_COLOR = '#EF4444'   # Red

def setup_ax(ax, title, subtitle):
    ax.set_facecolor(BG_COLOR)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_visible(False)
    ax.spines['bottom'].set_color(GRID_COLOR)
    ax.grid(True, axis='y', color=GRID_COLOR, linestyle='--', alpha=0.7, zorder=1)
    ax.tick_params(axis='x', colors=DIM_COLOR, labelsize=9, bottom=False)
    ax.tick_params(axis='y', colors=DIM_COLOR, labelsize=9, left=False)
    
    plt.suptitle(title, x=0.5, y=0.98, ha='center', fontsize=16, fontweight='bold', color=TEXT_COLOR)
    plt.title(subtitle, loc='center', fontsize=10, color=DIM_COLOR, pad=15)

def save_chart(fig, path):
    fig.text(0.95, 0.02, "Source : Eurostat / FRED / HORACLE CAPITAL", fontsize=7, fontweight='bold', color=DIM_COLOR, ha='right', alpha=0.7)
    plt.tight_layout(rect=[0, 0.05, 1, 0.93])
    plt.savefig(path, dpi=300, bbox_inches='tight', facecolor=BG_COLOR)
    print(f"Chart saved to {path}")

def fetch_fred_data(series_id):
    url = f"https://fred.stlouisfed.org/graph/fredgraph.csv?id={series_id}"
    try:
        df = pd.read_csv(url)
        df['observation_date'] = pd.to_datetime(df['observation_date'])
        df[series_id] = pd.to_numeric(df[series_id], errors='coerce')
        return df.dropna()
    except Exception as e:
        print(f"Error fetching {series_id}: {e}")
        return None

def generate_euro_inflation_chart():
    # HICP Euro Area (19 countries) - CP0000EZ19M086NEST (Index)
    # We need YoY change. Let's try to find a YoY series or calculate it.
    # FPCPITOTLZEU is annual, not high frequency.
    # Let's use the Index and calculate YoY: (Index / Index.shift(12) - 1) * 100
    series_id = "CP0000EZ19M086NEST"
    print(f"Fetching {series_id} from FRED...")
    df = fetch_fred_data(series_id)
    
    if df is None: return

    # Calculate YoY Change
    df['YoY'] = (df[series_id] / df[series_id].shift(12) - 1) * 100
    df = df.dropna()
    
    # Filter for last 3 years
    recent_df = df[df['observation_date'] >= (datetime.now() - timedelta(days=3*365))]
    
    last_val = recent_df['YoY'].iloc[-1]
    last_date = recent_df['observation_date'].iloc[-1]
    
    print(f"Audit Result: Latest HICP YoY for Euro Area is {last_val:.2f}% on {last_date.strftime('%Y-%m-%d')}")
    
    fig, ax = plt.subplots(figsize=(10, 5), facecolor=BG_COLOR)
    setup_ax(ax, "ZONE EURO : INFLATION HICP (YoY)", f"Dynamique de l'indice des prix à la consommation - Dernier : {last_val:.2f}%")
    
    ax.plot(recent_df['observation_date'], recent_df['YoY'], color=PRIMARY_COLOR, linewidth=2.5, zorder=3)
    ax.fill_between(recent_df['observation_date'], 0, recent_df['YoY'], alpha=0.1, color=PRIMARY_COLOR, zorder=2)
    
    # Target 2% line
    ax.axhline(2, color=DANGER_COLOR, linestyle=':', alpha=0.5, label='Cible BCE (2%)', zorder=1)
    
    ax.scatter(last_date, last_val, color=BG_COLOR, edgecolor=PRIMARY_COLOR, linewidth=2, s=60, zorder=4)
    ax.annotate(f"{last_val:.1f}%", xy=(last_date, last_val), xytext=(8, 0), textcoords="offset points", color=TEXT_COLOR, fontweight='bold', fontsize=11, va='center')
    
    ax.yaxis.set_major_formatter(mtick.PercentFormatter(decimals=1))
    
    save_chart(fig, "public/assets/img/euro_zone_CPI_07_06_26.png")

if __name__ == "__main__":
    generate_euro_inflation_chart()
