import React, { useState, useEffect } from 'react';
import { LABELS } from '../data/columns';
import BarChart from './charts/BarChart';
import ScatterPlot from './charts/ScatterPlot';
import WorldMap from './charts/WorldMap';
import RadarChart from './charts/RadarChart';
import ExpenseBreakdown from './charts/ExpenseBreakdown';
import CityFinder from './CityFinder';
import StudentBasket from './charts/StudentBasket';
import InsightPanel from './charts/InsightPanel';

const Dashboard = () => {
    const [cities, setCities] = useState([]);
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // State for City Insights
    const [insightCity, setInsightCity] = useState(null);

    // State for Comparison
    const [compareCities, setCompareCities] = useState([]);

    // State for Map Hover
    const [hoveredCity, setHoveredCity] = useState(null);

    // State for Student Hub
    const [studentCities, setStudentCities] = useState([]);

    useEffect(() => {
        Promise.all([
            fetch('/data/cities.json').then(res => res.json()),
            fetch('/data/countries.json').then(res => res.json())
        ])
        .then(([cityData, countryData]) => {
            setCities(cityData);
            setCountries(countryData);
            
            // Defaults
            const paris = cityData.find(c => c.city === 'Paris');
            const ny = cityData.find(c => c.city === 'New York');
            const tokyo = cityData.find(c => c.city === 'Tokyo');
            
            if(paris) setInsightCity(paris);
            if(paris && ny && tokyo) setCompareCities([paris, ny]);

            // Default Student Cities (Mix of affordable & popular)
            const studDefaults = ['Berlin', 'Warsaw', 'Prague', 'Lisbon', 'Madrid'];
            const studData = cityData.filter(c => studDefaults.includes(c.city));
            setStudentCities(studData);
            
            setLoading(false);
        })
        .catch(err => {
            console.error("Failed to load data:", err);
            setLoading(false);
        });
    }, []);

    const handleCompareChange = (e, index) => {
        const cityName = e.target.value;
        const cityData = cities.find(c => c.city === cityName);
        if (cityData) {
            const newSelection = [...compareCities];
            newSelection[index] = cityData;
            setCompareCities(newSelection);
        }
    };

    const handleStudentCityChange = (e) => {
        const cityName = e.target.value;
        const cityData = cities.find(c => c.city === cityName);
        if (cityData && !studentCities.find(c => c.city === cityName)) {
            // Keep max 6
            const newList = [...studentCities, cityData].slice(-6);
            setStudentCities(newList);
        }
    };

    if (loading) return <div style={{padding: '2rem', color: '#fff', textAlign:'center'}}>Loading Visualization Engine...</div>;

    const tabs = [
        { id: 'overview', label: 'Global Overview' },
        { id: 'insights', label: 'City Insights' },
        { id: 'student', label: 'Student Hub' },
        { id: 'compare', label: 'Compare Cities' },
        { id: 'planner', label: 'Budget Planner' }
    ];

    return (
        <div className="dashboard-container">
            <header className="header">
                <h1 className="animate-fade-in">Global Cost of Living</h1>
                <p className="text-muted animate-fade-in" style={{animationDelay: '0.1s'}}>
                    Analyze economic inequalities, purchasing power, and living costs worldwide.
                </p>
                
                <div 
                    className="animate-fade-in" 
                    style={{
                        display: 'flex', 
                        justifyContent: 'center', 
                        gap: '1rem', 
                        marginTop: '2rem',
                        marginBottom: '1rem',
                        animationDelay: '0.2s',
                        flexWrap: 'wrap'
                    }}
                >
                    {tabs.map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                background: activeTab === tab.id ? 'var(--primary)' : 'rgba(30, 41, 59, 0.5)',
                                color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
                <div className="animate-fade-in">
                    <section className="card" style={{marginBottom: '2rem'}}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem'}}>
                            <h2>🌍 Global Economic Landscape</h2>
                            <div className="text-muted" style={{fontSize: '0.9rem'}}>Regional Inequalities Map</div>
                        </div>
                        <WorldMap countryData={countries} cities={cities} onHover={setHoveredCity} />
                    </section>

                    <div className="grid-cols-2">
                        <section className="card">
                            <h2>Purchasing Power Parity</h2>
                            <p className="text-muted" style={{marginBottom: '1rem'}}>
                                Correlation between Avg Salary and Living Costs. Cities in the bottom-right offer the best quality of life (High Salary, Low Cost).
                            </p>
                            <ScatterPlot data={cities} />
                        </section>
                        
                        <section className="card p-0 overflow-hidden" style={{background: 'transparent', border: 'none'}}>
                           <InsightPanel cityData={hoveredCity} />
                        </section>
                    </div>
                </div>
            )}

            {/* TAB: CITY INSIGHTS */}
            {activeTab === 'insights' && (
                <div className="animate-fade-in grid-cols-2">
                     <section className="card">
                        <h2>🔍 Analyze a City</h2>
                        <div style={{margin: '1rem 0'}}>
                            <label className="text-muted" style={{display: 'block', marginBottom: '0.5rem'}}>Select City</label>
                            <select 
                                value={insightCity?.city || ''} 
                                onChange={(e) => setInsightCity(cities.find(c => c.city === e.target.value))}
                                style={{width: '100%'}}
                            >
                                {cities.map((c, i) => (
                                    <option key={i} value={c.city}>{c.city}, {c.country}</option>
                                ))}
                            </select>
                        </div>
                        
                        {insightCity && (
                            <div style={{textAlign: 'center', marginTop: '2rem'}}>
                                <div style={{fontSize: '3rem', fontWeight: 'bold'}}>${insightCity.estimated_monthly_cost_single.toFixed(0)}</div>
                                <div className="text-muted">Est. Monthly Cost (Single)</div>
                                
                                <div style={{display:'flex', justifyContent:'center', gap:'2rem', marginTop:'2rem'}}>
                                    <div>
                                        <div style={{fontSize:'1.5rem', color:'#10b981'}}>${insightCity.salary.toFixed(0)}</div>
                                        <div className="text-muted" style={{fontSize:'0.8rem'}}>Avg Salary</div>
                                    </div>
                                    <div>
                                        <div style={{fontSize:'1.5rem', color:'#f59e0b'}}>${insightCity.apt_1bed_city_center.toFixed(0)}</div>
                                        <div className="text-muted" style={{fontSize:'0.8rem'}}>Rent (1BR)</div>
                                    </div>
                                </div>
                            </div>
                        )}
                     </section>

                     <section className="card">
                        <h2>Expense Breakdown</h2>
                        <p className="text-muted">Estimated distribution of monthly expenses.</p>
                        {insightCity && <ExpenseBreakdown cityData={insightCity} />}
                     </section>
                </div>
            )}

            {/* TAB: STUDENT HUB */}
            {activeTab === 'student' && (
                <div className="animate-fade-in">
                    {/* Top Student Picks */}
                    <div style={{marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
                         {cities
                             .filter(c => c.estimated_monthly_cost_single < 1500 && c.internet > 0)
                             .sort((a,b) => (b.salary / b.estimated_monthly_cost_single) - (a.salary / a.estimated_monthly_cost_single))
                             .slice(0, 4)
                             .map((c, i) => (
                                 <div key={i} className="card hover-bg" style={{display:'flex', flexDirection:'column', gap:'5px', cursor:'pointer', borderLeft: '3px solid #10b981'}}>
                                     <div style={{fontSize:'0.8rem', color:'#10b981', fontWeight:'bold', textTransform:'uppercase'}}>Top Value Pick #{i+1}</div>
                                     <div style={{fontSize:'1.2rem', fontWeight:'bold'}}>{c.city}</div>
                                     <div style={{fontSize:'0.85rem', color:'#94a3b8'}}>{c.country}</div>
                                     <div style={{marginTop:'auto', paddingTop:'10px', fontSize:'0.8rem', display:'flex', justifyContent:'space-between'}}>
                                         <span>Cost: ${c.estimated_monthly_cost_single.toFixed(0)}</span>
                                         <span style={{color:'#facc15'}}>Save {((1 - c.estimated_monthly_cost_single/c.salary)*100).toFixed(0)}%</span>
                                     </div>
                                 </div>
                             ))
                         }
                    </div>

                    <section className="card" style={{marginBottom:'2rem', borderLeft: '4px solid #10b981'}}>
                        <h2>🎓 Student Budget Persona</h2>
                        <p className="text-muted">
                            Customize your lifestyle to see where you can afford to study.
                        </p>
                        <div style={{margin:'1rem 0'}}>
                            <label className="text-muted" style={{fontSize:'0.9rem', marginRight:'10px'}}>Add City to Compare:</label>
                            <select onChange={handleStudentCityChange} onClick={(e) => e.target.value = ''} style={{width:'auto'}}>
                                <option value="" disabled selected>Select a city</option>
                                {cities.map(c => <option key={c.city} value={c.city}>{c.city}</option>)}
                            </select>
                            <button className="text-muted" onClick={() => setStudentCities([])} style={{marginLeft:'10px', background:'transparent', border:'1px solid #334155'}}>Clear All</button>
                        </div>
                        <StudentBasket cities={studentCities} />
                    </section>
                    
                    <div className="grid-cols-2">
                        <section className="card">
                            <h3>🏠 Rent vs. Part-Time Salary</h3>
                            <p className="text-muted">Can you pay rent with a local job? High Value areas (Green/Blue) mean Salary exceeds Rent.</p>
                             <ScatterPlot 
                                data={cities} 
                                metricX="salary" 
                                metricY="apt_1bed_outside_center" 
                                labelX="Average Local Salary (USD)" 
                                labelY="Rent 1-Bed Outside Center (USD)"
                             />
                        </section>
                         <section className="card">
                            <h3>💸 Budget Tips for Students</h3>
                            <ul style={{lineHeight:'1.6', color:'#cbd5e1', paddingLeft:'1.2rem'}}>
                                <li style={{marginBottom:'10px'}}><strong>The "Outside Center" Hack:</strong> Rent drops by ~40% just 20 mins outside the city center. This is the #1 way to save.</li>
                                <li style={{marginBottom:'10px'}}><strong>Local Salary Reality:</strong> In many popular student hubs (London, Paris), a part-time job will NOT cover rent. Look at the chart on the left!</li>
                                <li><strong>Hidden Costs:</strong> Utilities and Internet can add $150+/month. Check the "Budget Persona" above to see the full breakdown.</li>
                            </ul>
                        </section>
                    </div>
                </div>
            )}

            {/* TAB: COMPARE */}
            {activeTab === 'compare' && (
                <div className="animate-fade-in">
                    <section className="card" style={{marginBottom: '2rem'}}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem'}}>
                            <h2>⚖️ Head-to-Head Comparison</h2>
                            <button onClick={() => setCompareCities(p => [...p, cities[0]].slice(0, 3))} style={{fontSize:'0.8rem'}}>+ Add City (Max 3)</button>
                        </div>
                        
                        <div style={{display:'flex', gap:'1rem', margin:'1rem 0', flexWrap:'wrap'}}>
                            {compareCities.map((city, idx) => (
                                <div key={idx} style={{flex: 1, minWidth: '200px'}}>
                                    <select 
                                        value={city?.city || ''} 
                                        onChange={(e) => handleCompareChange(e, idx)}
                                        style={{width: '100%'}}
                                    >
                                        {cities.map((c, i) => (
                                            <option key={i} value={c.city}>{c.city}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>

                        <div className="grid-cols-2">
                            <div>
                                <h3 style={{fontSize:'1.1rem', marginBottom:'1rem', textAlign:'center', color:'#94a3b8'}}>Normalized Cost Profile</h3>
                                <RadarChart 
                                    data={compareCities} 
                                    metrics={['apt_1bed_city_center', 'mc_meal', 'pass_monthly', 'utilities_basic', 'cinema', 'jeans']} 
                                    labels={{
                                        apt_1bed_city_center: 'Rent',
                                        mc_meal: 'Fast Food',
                                        pass_monthly: 'Transport',
                                        utilities_basic: 'Utilities',
                                        cinema: 'Entertainment',
                                        jeans: 'Clothing'
                                    }}
                                />
                            </div>
                            <div>
                                 <h3 style={{fontSize:'1.1rem', marginBottom:'1rem', textAlign:'center', color:'#94a3b8'}}>Cost vs Salary</h3>
                                 <BarChart 
                                    data={compareCities} 
                                    metric="salary" 
                                    label="Average Monthly Salary ($)" 
                                 />
                                 <div style={{height:'1rem'}}></div>
                                 <BarChart 
                                    data={compareCities} 
                                    metric="estimated_monthly_cost_single" 
                                    label="Monthly Cost of Living ($)" 
                                 />
                            </div>
                        </div>
                    </section>
                </div>
            )}

            {/* TAB: PLANNER */}
            {activeTab === 'planner' && (
                <div className="animate-fade-in">
                    <section className="card">
                        <h2>🎓 Budget Planner & City Finder</h2>
                        <p className="text-muted" style={{marginBottom: '2rem'}}>
                            Ideal for students and digital nomads. Find the perfect city that fits your financial constraints and lifestyle.
                        </p>
                        <CityFinder cities={cities} />
                    </section>
                </div>
            )}
            
            <footer className="text-muted" style={{textAlign:'center', marginTop:'2rem', fontSize:'0.8rem'}}>
                Global Cost of Living Dashboard • Created with React, D3.js & Love
            </footer>
        </div>
    );
};

export default Dashboard;
