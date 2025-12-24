import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import PropTypes from 'prop-types';
import { CITY_COORDINATES } from '../../data/coordinates';
import { Globe, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';

const METRICS = {
    cost: { label: 'Avg Monthly Cost ($)', keyCountry: 'avg_cost', keyCity: 'estimated_monthly_cost_single', scheme: d3.interpolateInferno, reverse: true },
    salary: { label: 'Avg Monthly Salary ($)', keyCountry: 'avg_salary', keyCity: 'salary', scheme: d3.interpolateViridis, reverse: false },
    rent: { label: '1 Bed Apt Outside Center ($)', keyCountry: null, keyCity: 'apt_1bed_outside_center', scheme: d3.interpolateMagma, reverse: true },
    food: { label: 'Inexpensive Meal ($)', keyCountry: null, keyCity: 'meal_inexpensive', scheme: d3.interpolateSpectral, reverse: true }
};

const WorldMap = ({ countryData, cities, onHover }) => {
    const svgRef = useRef();
    const containerRef = useRef();
    const [tooltip, setTooltip] = useState(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 600 });
    const [activeMetric, setActiveMetric] = useState('cost');
    // Optimized: Use Ref for rotation to avoid React Render Cycle blocking
    const rotationRef = useRef([0, 0]);
    const isDragging = useRef(false);

    // Responsive
    useEffect(() => {
        if (!containerRef.current) return;
        const resizeObserver = new ResizeObserver(entries => {
            if (!entries.length) return;
            const { width } = entries[0].contentRect;
            if (width > 0) setDimensions(d => ({ ...d, width }));
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // Drawing Logic
    useEffect(() => {
        if (!countryData || dimensions.width === 0) return;
        const { width, height } = dimensions;
        
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const config = METRICS[activeMetric];

        // Prepare Scales
        const extent = d3.extent(cities.filter(c => c[config.keyCity] > 0), d => d[config.keyCity]);
        if (!extent[0]) extent[0] = 0;
        if (!extent[1]) extent[1] = 1000;

        const colorScale = d3.scaleSequential(config.scheme).domain(config.reverse ? [extent[1], extent[0]] : extent);

        // Projection setup
        const globeSize = Math.min(width, height) / 2 - 20;
        const projection = d3.geoOrthographic()
            .scale(globeSize)
            .translate([width / 2, height / 2])
            .clipAngle(90)
            .rotate(rotationRef.current);

        const path = d3.geoPath().projection(projection);

        // Layers
        const defs = svg.append('defs');
        
        // Atmosphere Glow
        const filter = defs.append('filter').attr('id', 'glow');
        filter.append('feGaussianBlur').attr('stdDeviation', '5').attr('result', 'coloredBlur');
        const feMerge = filter.append('feMerge');
        feMerge.append('feMergeNode').attr('in', 'coloredBlur');
        feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

        // Styles
        svg.append('circle')
            .attr('cx', width / 2)
            .attr('cy', height / 2)
            .attr('r', globeSize)
            .attr('fill', '#1e293b')
            .attr('stroke', '#0f172a')
            .attr('stroke-width', 2);

        svg.append('circle')
            .attr('cx', width / 2)
            .attr('cy', height / 2)
            .attr('r', globeSize)
            .attr('fill', 'none')
            .attr('stroke', 'rgba(56, 189, 248, 0.3)')
            .attr('stroke-width', 10)
            .attr('filter', 'url(#glow)')
            .style('pointer-events', 'none');

        const mapGroup = svg.append('g');
        const cityGroup = svg.append('g');

        // Render Data
        d3.json('/data/world.json').then(world => {
            const countries = topojson.feature(world, world.objects.countries).features;
            
            const countryMap = new Map();
            countryData.forEach(d => countryMap.set(d.country, d));

            const paths = mapGroup.selectAll('path')
                .data(countries)
                .join('path')
                .attr('d', path)
                .attr('fill', d => {
                    const cData = countryMap.get(d.properties.name);
                    if (config.keyCountry && cData && cData[config.keyCountry]) {
                        return d3.color(colorScale(cData[config.keyCountry])).darker(0.3);
                    }
                    return '#0f172a';
                })
                .attr('stroke', '#334155')
                .attr('stroke-width', 0.5);

            const cityPoints = cities
                .filter(c => CITY_COORDINATES[c.city] && c[config.keyCity])
                .map(c => ({ 
                    ...c, 
                    coords: CITY_COORDINATES[c.city]
                }));
            
            const circles = cityGroup.selectAll('circle')
                .data(cityPoints)
                .join('circle')
                .attr('r', 4)
                .attr('fill', d => colorScale(d[config.keyCity]))
                .attr('stroke', '#fff')
                .attr('stroke-width', 1.5)
                .attr('cursor', 'pointer')
                .on('mouseenter', (event, d) => {
                    if (isDragging.current) return;
                    d3.select(event.target).attr('stroke', '#facc15').attr('r', 8).raise();
                    
                    const [x, y] = d3.pointer(event, containerRef.current);
                    setTooltip({ x, y, data: d });
                    if(onHover) onHover(d);
                })
                .on('mouseleave', (event) => {
                    d3.select(event.target).attr('stroke', '#fff').attr('r', 4);
                    setTooltip(null);
                    if(onHover) onHover(null);
                });

            // Update function for animation
            const updatePaths = () => {
                projection.rotate(rotationRef.current);
                paths.attr('d', path);
                circles.each(function(d) {
                    const projected = projection(d.coords);
                    if (projected && path({type: 'Point', coordinates: d.coords})) { // Visibility check
                         d3.select(this)
                            .attr('cx', projected[0])
                            .attr('cy', projected[1])
                            .attr('display', 'block');
                    } else {
                        d3.select(this).attr('display', 'none');
                    }
                });
            };

            // Drag Behavior
            const drag = d3.drag()
                .on('start', () => { 
                    isDragging.current = true; 
                    svg.style('cursor', 'grabbing');
                })
                .on('drag', (event) => {
                    const k = 0.5;
                    const r = rotationRef.current;
                    rotationRef.current = [r[0] + event.dx * k, r[1] - event.dy * k];
                    updatePaths();
                })
                .on('end', () => { 
                    isDragging.current = false;
                    svg.style('cursor', 'grab');
                });

            svg.call(drag);

            // optimized timer
            const timer = d3.timer(() => {
                if (isDragging.current) return;
                const r = rotationRef.current;
                rotationRef.current = [r[0] + 0.1, r[1]];
                updatePaths();
            });

            // Cleanup timer specifically for this render cycle
            return () => timer.stop(); 
        });
        
    }, [countryData, cities, dimensions, activeMetric, onHover]); // Removed rotation from deps

    // Removed separate timer useEffects as they are now integrated within the data load scope for closure access to 'paths' and 'circles'

    return (
        <div ref={containerRef} className="chart-container" style={{ 
            height: '600px', 
            position: 'relative', 
            overflow: 'hidden', 
            background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)', // Spaced theme
            borderRadius: '1rem', 
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)'
        }}>
            <svg ref={svgRef} width="100%" height="100%" style={{cursor: 'grab'}}></svg>
            
            {/* Controls */}
            <div style={{ position: 'absolute', top: 20, right: 20, width: '180px', zIndex: 10 }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '6px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {Object.entries(METRICS).map(([key, conf]) => (
                        <button 
                            key={key}
                            onClick={() => setActiveMetric(key)}
                            style={{
                                width: '100%',
                                textAlign: 'left',
                                background: activeMetric === key ? 'var(--primary)' : 'transparent',
                                color: activeMetric === key ? '#fff' : '#94a3b8',
                                border: 'none',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '500',
                                marginBottom: '2px',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                             <div style={{width: 8, height: 8, borderRadius: '50%', background: activeMetric === key ? '#fff' : 'transparent', border: '1px solid currentColor'}}></div>
                            {conf.label}
                        </button>
                    ))}
                </div>
            </div>
            
             <div style={{position:'absolute', bottom: 20, right: 20, display:'flex', flexDirection:'column', gap:'5px', pointerEvents:'none'}}>
                <div style={{background: 'rgba(0,0,0,0.5)', padding: '5px 10px', borderRadius:'4px', color:'#94a3b8', fontSize:'11px', textAlign:'right'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'5px', justifyContent:'flex-end'}}>
                        <RefreshCw size={12} /> Drag to Rotate
                    </div>
                </div>
            </div>

            {/* Legend - Reused from before */}
            <div style={{ position: 'absolute', bottom: 20, left: 20, pointerEvents: 'none', minWidth: '200px' }}>
               <div style={{ background: 'rgba(0,0,0,0.6)', padding: '12px 16px', borderRadius: '8px', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.05)' }}>
                   <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                       Selected Metric
                   </div>
                   <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>
                       {METRICS[activeMetric].label}
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <span style={{ fontSize: '10px', color: '#cbd5e1' }}>Low</span>
                       <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: `linear-gradient(to right, ${d3.interpolate(METRICS[activeMetric].scheme)(0)}, ${d3.interpolate(METRICS[activeMetric].scheme)(0.5)}, ${d3.interpolate(METRICS[activeMetric].scheme)(1)})` }}></div>
                       <span style={{ fontSize: '10px', color: '#cbd5e1' }}>High</span>
                   </div>
               </div>
            </div>
            
            {/* Tooltip */}
            {tooltip && !isDragging.current && (
                <div className="chart-tooltip" 
                     style={{ 
                        top: tooltip.y, 
                        left: tooltip.x,
                        transform: 'translate(-50%, -120%)',
                        pointerEvents: 'none',
                        zIndex: 20
                     }}>
                    <div style={{fontWeight:'bold'}}>{tooltip.data.city}</div>
                    <div style={{fontSize:'0.8rem', color:'#cbd5e1'}}>{tooltip.data.country}</div>
                </div>
            )}
        </div>
    );
};

WorldMap.propTypes = {
    countryData: PropTypes.array.isRequired,
    cities: PropTypes.array.isRequired,
    onHover: PropTypes.func
};

export default WorldMap;
