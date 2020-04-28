const b_width = 500;
const d_width = 500;
const b_height = 1000;
const d_height = 1000;
const colors = [
    '#DB202C','#a6cee3','#1f78b4',
    '#33a02c','#fb9a99','#b2df8a',
    '#fdbf6f','#ff7f00','#cab2d6',
    '#6a3d9a','#ffff99','#b15928']

// Part 1: Создать шкалы для цвета, радиуса и позиции
const radius = d3.scaleLinear().range([.5, 20]);
const color = d3.scaleOrdinal().range(colors);
const x = d3.scaleLinear().range([0, b_width]);

const bubble = d3.select('.bubble-chart')
    .attr('width', b_width).attr('height', b_height);
const donut = d3.select('.donut-chart')
    .attr('width', d_width).attr('height', d_height)
    .append("g")
        .attr("transform", "translate(" + d_width / 2 + "," + d_height / 2 + ")");

const donut_lable = d3.select('.donut-chart').append('text')
        .attr('class', 'donut-lable')
        .attr("text-anchor", "middle")
        .attr('transform', `translate(${(d_width/2)} ${d_height/2})`);
//const tooltip = d3.select('.tooltip').style("position", "absolute").style("visibility", "hidden").text("a simple tooltip");
//.style("opacity", 0)

//const tooltip=d3.select('.bubble-chart') .append("div").style("position", "absolute").style("visibility", "hidden").text("a simple tooltip");
const tooltip = d3.select(".t")

  .style("opacity", 0)

  .style('position','absolute')
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "10px")

;

//  Part 1 - Создать симуляцию с использованием forceCenter(), forceX() и forceCollide()
//const centr=d3.forceCenter(1000);
//const Xs=d3.forceX();
//const coll=d3.forceCollide() ;

   // ..


d3.csv('data/netflix.csv').then(data=>{
    data = d3.nest().key(d=>d.title).rollup(d=>d[0]).entries(data).map(d=>d.value).filter(d=>d['user rating score']!=='NA');

console.log(data);
console.log(data.map(d=>d['rating']));

    const rating = data.map(d=>+d['user rating score']);
    const years = data.map(d=>+d['release year']);
    let ratings = d3.nest().key(d=>d.rating).rollup(d=>d.length).entries(data);
    //console.log(ratings)
        console.log(ratings)

    // Part 1 - задать domain  для шкал цвета, радиуса и положения по x
    // ..
    let xRange = data.map(d=> +d['release year']);
    //x.domain([d3.min(xRange),d3.max(xRange)]);
    x.domain([d3.min(years),d3.max(years)]);
    let colRange=d3.nest().key(function(d,i){return d['rating']}).entries(data).map(d=>d.key);
    color.domain(colRange);
    let rRange=data.map(d=> +d['user rating score']);
    radius.domain([d3.min(rRange),d3.max(rRange)])
    // Part 1 - создать circles на основе data
    const simulation = d3.forceSimulation(data)
    .force('center',d3.forceCenter(250,500))
    .force('forceX',d3.forceX().x(function(d,i) {return x(xRange[i]);}))
    .force('collide',d3.forceCollide())//.radius(function(d,i) { return radius(rRange[i]) ; }))

 .on('tick',ticked);

function ticked(){
  var nodes = bubble.selectAll("circle").data(data);
  nodes.enter().append('circle').attr('r', function(d,i) { return radius(rRange[i]) ; }).merge(nodes)
  .attr('cx', function(d) {return d.x;})
.attr('cy', function(d) {
 return d.y;
})
 .style("fill", function(d,i) { return color(data.map(d=> d['rating'])[i]);})
 nodes.on('mouseover', overBubble);
 nodes.on('mouseout', outOfBubble);

nodes.exit().remove();
}


          //.attr('cx', function(d) {return d.x;})
//.attr('cy', function(d) { return d.y ;})
//.attr('r', function(d,i) { return radius(rRange[i]) ; })
        // ..


  //  .nodes(nodes).on('tick',function(d){
    //  nodes
      //.attr("cx",  function(d,i) {return x(xRange[i]);})
      //.attr('r', function(d,i) { return radius(rRange[i]) ; });


      //.attr("cy", function(d) { return d.y; })

    //  ;})

    ;

    //function ticked() {
    //   nodes
    //   .attr("cx", function(d) { return d.x; })
  //     .attr("cy", function(d) { return d.y; });
//}

    // добавляем обработчики событий mouseover и mouseout
            // simulation.on('mouseover', overBubble)
            //simulation.on('mouseout', outOfBubble);


    // Part 1 - передать данные в симуляцию и добавить обработчик события tick
    // ..
    //simulation

    // Part 1 - Создать шаблон при помощи d3.pie() на основе ratings
    // ..
    const arcs = d3.pie().value(function(d) {return d.value; })(ratings);
   console.log(arcs)
   console.log(ratings)
//console.log(data.filter(function(d) { return d.rating == "for_bath"; }););
   var arc = d3.arc()
      .innerRadius(100) // it'll be donut chart
       .outerRadius(200)
       .padAngle(0.02)
       .cornerRadius(5);

   donut.selectAll('path')
 .data(arcs)
 .enter().append('path')
 .attr('d', arc) // каждый элемент будет передан в генератор
 .attr('fill', function(d,i) { return(color(d.data.key));})
 .style("opacity", 0.7).on('mouseover', overArc).on('mouseout', outOfArc);

    // Part 1 - Создать генератор арок при помощи d3.arc()
    // ..

    // Part 1 - построить donut chart внутри donut
    // ..

    // добавляем обработчики событий mouseover и mouseout
      //  arcs.on('mouseover', overArc);
        //.on('mouseout', outOfArc);

    function overBubble(d){
        console.log(d)
        console.log( d3.select(this));
         d3.select(this).style("stroke","blue").attr("stroke-width",2)
        // Part 2 - задать stroke и stroke-width для выделяемого элемента
        // ..

        // Part 3 - обновить содержимое tooltip с использованием классов title и year
        // ..
        //tooltip.style("visibility", "visible").text('asdfvf');
        //tooltip
          //.style("opacity", 1).style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px").text(d['title']+', '+d['release year']);

        // Part 3 - изменить display и позицию tooltip
        // ..
    }
    function outOfBubble(){
      d3.select(this).attr("stroke-width",0)//.style("stroke",'white')
        // Part 2 - сбросить stroke и stroke-width
        // ..

        // Part 3 - изменить display у tooltip
        // ..
        //tooltip.style("opacity", 0)
    }

    function overArc(d){
        console.log(d.data.key)
        text=d.data.key
        // Part 2 - изменить содержимое donut_lable
        donut_lable.text(text)
        d3.select(this).style("opacity",0.3)
        // ..
        // Part 2 - изменить opacity арки
        // ..
        //d3.select(this).style("opacity",0.3)
        // Part 3 - изменить opacity, stroke и stroke-width для circles в зависимости от rating
        // ..d=>d['rating']
        //data.filter(function(d) { return d.rating == "for_bath"; }););
        //console.log(data.filter(function(d) { return d.rating==text;}));
        //console.log(Object.keys(d3.selectAll('circle')['_groups']['0']['0']['__data__']));
        //asd1=d3.selectAll('circle').data(data.filter(function(d) { return d.rating!=text;}));
        //asd1.style("stroke","red").style("opacity",0.1)//.attr("stroke-width",3);
        //console.log(d3.selectAll('circle').data(data.filter(function(d) { return d.rating==text;})).style("stroke","red").style("opacity",100).attr("stroke-width",2));
        //console.log(d3.select(data.filter(function(d) { return d.rating==text;})));
        //d3.select(data.filter(function(d) { return d.rating==text;})).style("stroke","blue")
         //bubble.select("circle").data(data.filter(function(d) { return d.rating==text;})).enter().style("stroke","blue");
    }
    function outOfArc(){
        // Part 2 - изменить содержимое donut_lable
        // ..
        // Part 2 - изменить opacity арки
        // ..
        donut_lable.text(' ')
        d3.select(this).style("opacity",0.7)
        //asd1.attr("stroke-width",0).style("opacity",1)
        // Part 3 - вернуть opacity, stroke и stroke-width для circles
        // ..
    }
});
