export default function MetricCard({ title, value, icon, colorClass = "metric-card__icon--gold", trendText }) {
    return (
        <div className="metric-card">
        <div className={`metric-card__icon ${colorClass}`}>
            <i className={`fa-solid ${icon}`}></i>
        </div>
        <div className="metric-card__body">
            <p className="metric-card__label">{title}</p>
            <p className="metric-card__value">{value}</p>
            {trendText && (
            <p className="metric-card__trend metric-card__trend--neutral">
                <i className="fa-solid fa-circle-dot"></i> {trendText}
            </p>
            )}
        </div>
        </div>
    );
}