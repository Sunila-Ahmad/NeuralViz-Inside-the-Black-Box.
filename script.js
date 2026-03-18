// --- D3 Network Setup ---
const svg = d3.select("#network-svg");
const width = 600;
const height = 400;

// Define Network structure: [Input Layers, Hidden Layer Neurons, Output Layers]
const nodes = [
    {id: 'in1', x: 100, y: 100, label: 'Input 1'},
    {id: 'in2', x: 100, y: 300, label: 'Input 2'},
    {id: 'h1', x: 300, y: 100, label: 'Hidden 1'},
    {id: 'h2', x: 300, y: 200, label: 'Hidden 2'},
    {id: 'h3', x: 300, y: 300, label: 'Hidden 3'},
    {id: 'out1', x: 500, y: 200, label: 'Output'}
];

const links = [
    {source: 'in1', target: 'h1'}, {source: 'in1', target: 'h2'}, {source: 'in1', target: 'h3'},
    {source: 'in2', target: 'h1'}, {source: 'in2', target: 'h2'}, {source: 'in2', target: 'h3'},
    {source: 'h1', target: 'out1'}, {source: 'h2', target: 'out1'}, {source: 'h3', target: 'out1'}
];

// --- Draw Nodes (Neuron circles) ---
svg.selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", 15)
    .attr("fill", "#1e293b")
    .attr("stroke", "white")
    .attr("id", d => d.id);

// --- Draw Links (Weight lines) ---
svg.selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("x1", d => nodes.find(n => n.id === d.source).x)
    .attr("y1", d => nodes.find(n => n.id === d.source).y)
    .attr("x2", d => nodes.find(n => n.id === d.target).x)
    .attr("y2", d => nodes.find(n => n.id === d.target).y)
    .attr("stroke", "#30363d")
    .attr("stroke-width", 2)
    .attr("class", d => `link-${d.source} link-${d.target}`);


// --- Animation 1: FORWARD PROPAGATION ---
function startForwardProp() {
    d3.select("#explanationText").text("Prediction: Data flows forward. Neurons are 'activating' based on random weights.");
    d3.select("#btnForward").attr("disabled", true);
    
    // Animate data flow along links
    svg.selectAll("line")
        .transition()
        .duration(1000)
        .delay((d, i) => i * 100)
        .attr("stroke", "#00f2ff")
        .attr("stroke-width", 4);
        
    // Activate Nodes
    svg.selectAll("circle")
        .transition()
        .duration(500)
        .delay((d, i) => i * 200 + 500)
        .attr("fill", "#00f2ff")
        .attr("stroke", "#000");

    setTimeout(() => {
        d3.select("#out1").attr("fill", "#ff004c"); // Output showing high error
        d3.select("#explanationText").html("🛑 <b>High Error!</b> The output prediction (Red) is wrong because weights are random. We need Backprop.");
        d3.select("#btnBack").attr("disabled", null);
    }, 2500);
}

// --- Animation 2: BACKPROPAGATION (Gradient Descent) ---
function startBackProp() {
    d3.select("#explanationText").text("Error Check & Update: The error signal flows backward. We are using Calculus to find out how to tweak the weights.");
    d3.select("#btnBack").attr("disabled", true);

    // Reverse Data Flow (Signal links in Red)
    svg.selectAll("line")
        .transition()
        .duration(1000)
        .delay((d, i) => i * 100)
        .attr("stroke", "#ff004c");

    setTimeout(() => {
        d3.select("#explanationText").html("✅ <b>Weights Updated!</b> Calculus found the 'gradient.' The model will make a slightly better prediction next time.");
        
        // Reset Network but keep Output green to show learning
        svg.selectAll("circle").attr("fill", "#1e293b");
        svg.selectAll("line").attr("stroke", "#30363d").attr("stroke-width", 2);
        d3.select("#out1").attr("fill", "#10b981"); // Learning complete
        
        d3.select("#btnForward").attr("disabled", null);
    }, 2500);
}