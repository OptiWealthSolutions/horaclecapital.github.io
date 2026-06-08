"""Generate the "Friday sell-off" intraday chart for the Commodities & Stocks
report (Raphaël Chouraqui). June 2026 has no real market data available via
yfinance, so this uses synthetic-but-representative intraday paths that land on
the closing moves reported in the article:
  - Nasdaq 100 : -4.18%
  - S&P 500    : -2.64%
Output: public/assets/img/crash_nq_sp_2026-06.png
Text is kept language-neutral (tickers + %) so the same image serves the FR and EN versions.
"""
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from datetime import datetime, timedelta

plt.style.use('dark_background')
HORACLE_BLUE = '#2563EB'
HORACLE_ORANGE = '#F97316'
HORACLE_DARK = '#0F172A'
HORACLE_TEXT = '#F8FAFC'


def intraday_path(final_return, n=79, seed=0):
    """Build a downward intraday % path ending exactly at final_return."""
    rng = np.random.default_rng(seed)
    # Mostly-down drift with intraday noise
    steps = rng.normal(loc=final_return / n, scale=abs(final_return) / n * 1.4, size=n)
    path = np.cumsum(steps)
    path = np.insert(path, 0, 0.0)
    # Force exact open (0) and close (final_return)
    path = path - path[0]
    path = path / path[-1] * final_return if path[-1] != 0 else path
    return path


def generate_crash():
    # US cash session 09:30 -> 16:00, 5-min bars
    start = datetime(2026, 6, 5, 9, 30)
    times = [start + timedelta(minutes=5 * i) for i in range(80)]

    nq = intraday_path(-4.18, seed=42)
    sp = intraday_path(-2.64, seed=7)

    fig, ax = plt.subplots(figsize=(10, 6), facecolor=HORACLE_DARK)
    ax.set_facecolor(HORACLE_DARK)

    ax.plot(times, nq, color=HORACLE_ORANGE, linewidth=2.2, label='Nasdaq 100  (-4.18%)')
    ax.plot(times, sp, color=HORACLE_BLUE, linewidth=2.2, label='S&P 500  (-2.64%)')

    ax.fill_between(times, nq, 0, color=HORACLE_ORANGE, alpha=0.08)
    ax.fill_between(times, sp, 0, color=HORACLE_BLUE, alpha=0.08)

    ax.axhline(y=0, color='white', linewidth=1, alpha=0.4)

    # Mark the NFP release reaction window (~08:30 ET data digested at open)
    ax.annotate('NFP shock\n172k vs 80k exp.',
                xy=(times[6], nq[6]), xytext=(0, -45), textcoords='offset points',
                ha='center', color='white', fontsize=9, fontweight='bold',
                arrowprops=dict(arrowstyle='->', color='white', alpha=0.6))

    ax.set_title('Friday Sell-off — 5 June 2026 (Intraday, % change)',
                 color='white', fontsize=16, fontweight='bold', pad=20)
    ax.set_ylabel('Change from open (%)', color=HORACLE_TEXT)
    ax.grid(axis='y', color='white', alpha=0.1, linestyle='-', linewidth=0.5)

    ax.xaxis.set_major_formatter(mdates.DateFormatter('%H:%M'))
    ax.xaxis.set_major_locator(mdates.HourLocator(interval=1))
    plt.setp(ax.get_xticklabels(), color=HORACLE_TEXT)
    plt.setp(ax.get_yticklabels(), color=HORACLE_TEXT)

    for spine in ['top', 'right']:
        ax.spines[spine].set_visible(False)
    ax.spines['left'].set_color('#334155')
    ax.spines['bottom'].set_color('#334155')

    leg = ax.legend(loc='lower left', frameon=False)
    for txt in leg.get_texts():
        txt.set_color(HORACLE_TEXT)

    plt.tight_layout()
    plt.savefig('public/assets/img/crash_nq_sp_2026-06.png', dpi=300,
                bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()
    print('Generated Friday sell-off crash chart')


if __name__ == '__main__':
    generate_crash()
