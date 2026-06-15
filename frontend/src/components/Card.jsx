import './Card.css';

export default function Card({ children, title, className = '', glow = false }) {
  return (
    <div className={`card glass-panel ${glow ? 'glow-effect' : ''} ${className}`}>
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}
