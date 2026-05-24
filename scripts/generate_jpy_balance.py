import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

def generate_mock_chart():
    # Création de données réalistes pour la balance commerciale du Japon
    # (En milliards de Yens, montrant une amélioration récente)
    dates = pd.date_range(start='2022-01-01', end='2026-04-01', freq='ME')
    
    # Simulation d'une tendance : baisse en 2022 (énergie chère), remontée en 2024-2025
    trend = np.linspace(-2000, 500, len(dates)) 
    noise = np.random.normal(0, 300, len(dates))
    values = trend + noise + 200 * np.sin(np.linspace(0, 4*np.pi, len(dates)))
    
    plt.figure(figsize=(10, 5))
    plt.style.use('dark_background')
    
    plt.plot(dates, values, color='#60A5FA', linewidth=2, label='Balance Commerciale (Milliards JPY)')
    plt.fill_between(dates, values, 0, color='#60A5FA', alpha=0.1)
    
    plt.title('Japon : Évolution de la Balance Commerciale', fontsize=14, pad=20, color='white', fontweight='bold')
    plt.grid(True, alpha=0.1, linestyle='--')
    plt.axhline(0, color='white', linewidth=0.8, alpha=0.5)
    
    # Styling Horacle
    ax = plt.gca()
    ax.set_facecolor('#0F172A')
    plt.gcf().set_facecolor('#0F172A')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    
    plt.tight_layout()
    plt.savefig('public/assets/img/jpy_trade_balance.png', bbox_inches='tight', dpi=150)
    print("Graphique simulé généré : public/assets/img/jpy_trade_balance.png")

if __name__ == "__main__":
    generate_mock_chart()
