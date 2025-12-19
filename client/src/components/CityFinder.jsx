import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CityFinder = ({ cities }) => {
    const [budget, setBudget] = useState(2000);
    const [minSalary, setMinSalary] = useState(0);
    const [sortBy, setSortBy] = useState('cost_low');
    const [results, setResults] = useState([]);

    const handleSearch = () => {
        let filtered = cities.filter(c => {
            // Check if data exists
            if (!c.estimated_monthly_cost_single) return false;
            
            // Budget Filter (Cost < Budget)
            const fitsBudget = c.estimated_monthly_cost_single <= budget;
            // Salary Filter (Salary > Min)
            const fitsSalary = c.salary >= minSalary;

            return fitsBudget && fitsSalary;
        });

        // Sorting
        if (sortBy === 'cost_low') {
            filtered.sort((a, b) => a.estimated_monthly_cost_single - b.estimated_monthly_cost_single);
        } else if (sortBy === 'salary_high') {
            filtered.sort((a, b) => b.salary - a.salary);
        } else if (sortBy === 'power_high') {
            filtered.sort((a, b) => (b.salary / b.estimated_monthly_cost_single) - (a.salary / a.estimated_monthly_cost_single));
        }

        setResults(filtered.slice(0, 20)); // Top 20
    };

    return (
        <div style={{color: '#fff'}}>
            <div style={{
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <div>
                    <label style={{display:'block', marginBottom:'0.5rem', color:'#94a3b8'}}>Max Monthly Budget ($)</label>
                    <input 
                        type="number" 
                        value={budget} 
                        onChange={e => setBudget(Number(e.target.value))}
                        style={{width:'100%'}}
                    />
                </div>
                <div>
                    <label style={{display:'block', marginBottom:'0.5rem', color:'#94a3b8'}}>Min Net Salary ($)</label>
                    <input 
                        type="number" 
                        value={minSalary} 
                        onChange={e => setMinSalary(Number(e.target.value))} 
                        style={{width:'100%'}}
                    />
                </div>
                <div>
                    <label style={{display:'block', marginBottom:'0.5rem', color:'#94a3b8'}}>Sort By</label>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{width:'100%'}}>
                        <option value="cost_low">Lowest Cost</option>
                        <option value="salary_high">Highest Salary</option>
                        <option value="power_high">Best Purchasing Power</option>
                    </select>
                </div>
                <div style={{display:'flex', alignItems:'flex-end'}}>
                    <button onClick={handleSearch} style={{width:'100%'}}>Find Cities</button>
                </div>
            </div>

            <div style={{display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))'}}>
                {results.map((city, i) => {
                    const power = (city.salary / city.estimated_monthly_cost_single).toFixed(2);
                    return (
                        <div key={i} className="card" style={{padding:'1rem'}}>
                            <div style={{fontSize:'1.1rem', fontWeight:'600', marginBottom:'0.5rem'}}>{city.city}</div>
                            <div style={{color:'#94a3b8', fontSize:'0.9rem', marginBottom:'0.5rem'}}>{city.country}</div>
                            
                            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'4px', fontSize:'0.9rem'}}>
                                <span style={{color:'#94a3b8'}}>Cost:</span>
                                <span>${city.estimated_monthly_cost_single.toFixed(0)}</span>
                            </div>
                            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'4px', fontSize:'0.9rem'}}>
                                <span style={{color:'#94a3b8'}}>Salary:</span>
                                <span>${city.salary.toFixed(0)}</span>
                            </div>
                            <div style={{display:'flex', justifyContent:'space-between', marginTop:'0.5rem', paddingTop:'0.5rem', borderTop:'1px dashed rgba(255,255,255,0.1)', fontSize:'0.9rem'}}>
                                <span style={{color:'#94a3b8'}}>Power:</span>
                                <span style={{color: power > 1.5 ? '#10b981' : '#f59e0b'}}>{power}x</span>
                            </div>
                        </div>
                    );
                })}
                {results.length === 0 && <div style={{textAlign:'center', color:'#94a3b8', gridColumn:'1/-1'}}>Adjust filters and click Find to see cities.</div>}
            </div>
        </div>
    );
};

CityFinder.propTypes = {
    cities: PropTypes.array.isRequired
};

export default CityFinder;
