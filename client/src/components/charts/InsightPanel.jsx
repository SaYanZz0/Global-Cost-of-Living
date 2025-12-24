import React from 'react';
import PropTypes from 'prop-types';

const InsightPanel = ({ cityData }) => {
    if (!cityData) {
        return (
            <div className="card h-full flex flex-col items-center justify-center text-center p-8 opacity-50" style={{minHeight: '300px'}}>
                <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🌍</div>
                <h3>Explore the World</h3>
                <p className="text-muted">Hover over a city on the map to see detailed economic insights.</p>
            </div>
        );
    }

    // Calculators
    const totalCost = cityData.estimated_monthly_cost_single;
    const salary = cityData.salary;
    const savings = Math.max(0, salary - totalCost);
    const savingsRate = (savings / salary) * 100;

    // Purchasing Power Color (Higher is better)
    const ppColor = savingsRate > 20 ? '#10b981' : (savingsRate > 0 ? '#f59e0b' : '#ef4444');

    return (
        <div className="card animate-fade-in" style={{height:'100%', borderColor: 'var(--primary)', boxShadow: '0 0 15px rgba(99, 102, 241, 0.1)'}}>
            <div style={{borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem'}}>
                <h2 style={{margin:0, fontSize: '1.8rem'}}>{cityData.city}</h2>
                <div className="text-muted" style={{textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem'}}>{cityData.country}</div>
            </div>

            <div className="grid-cols-2" style={{gap: '1rem', marginBottom: '1.5rem'}}>
                <div style={{background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '0.5rem'}}>
                    <div className="text-muted" style={{fontSize: '0.8rem'}}>Monthly Cost</div>
                    <div style={{fontSize: '1.5rem', fontWeight: 'bold'}}>${totalCost.toFixed(0)}</div>
                </div>
                <div style={{background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '0.5rem'}}>
                    <div className="text-muted" style={{fontSize: '0.8rem'}}>Net Salary</div>
                    <div style={{fontSize: '1.5rem', fontWeight: 'bold'}}>${salary.toFixed(0)}</div>
                </div>
            </div>

            <div style={{marginBottom: '1.5rem'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'0.5rem'}}>
                    <span className="text-muted">Savings Potential</span>
                    <span style={{color: ppColor, fontWeight:'bold'}}>{savingsRate.toFixed(1)}%</span>
                </div>
                <div style={{width: '100%', height: '8px', background: '#334155', borderRadius: '4px', overflow: 'hidden'}}>
                    <div style={{
                        width: `${Math.min(100, Math.max(0, savingsRate))}%`, 
                        height: '100%', 
                        background: ppColor,
                        transition: 'width 0.3s ease-out'
                    }}></div>
                </div>
                <div style={{fontSize:'0.8rem', color:'#94a3b8', marginTop:'5px'}}>
                    {savings > 0 ? `You could save ~$${savings.toFixed(0)}/mo` : 'Expenses exceed average salary'}
                </div>
            </div>

            <h4 style={{marginBottom: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem'}}>Student Metrics</h4>
            
            <div className="metric-row" style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.8rem'}}>
                <span className="text-muted">🏠 Rent (Outside)</span>
                <span style={{fontWeight:'500'}}>${cityData.apt_1bed_outside_center?.toFixed(0)}</span>
            </div>
             <div className="metric-row" style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.8rem'}}>
                <span className="text-muted">🍔 Cheap Meal</span>
                <span style={{fontWeight:'500'}}>${cityData.meal_inexpensive?.toFixed(2)}</span>
            </div>
             <div className="metric-row" style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.8rem'}}>
                <span className="text-muted">🍺 Beer</span>
                <span style={{fontWeight:'500'}}>${cityData.beer_domestic_market?.toFixed(2)}</span>
            </div>
             <div className="metric-row" style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <span className="text-muted">🚍 Transport</span>
                <span style={{fontWeight:'500'}}>${cityData.pass_monthly?.toFixed(0)}</span>
            </div>

        </div>
    );
};

InsightPanel.propTypes = {
    cityData: PropTypes.object
};

export default InsightPanel;
