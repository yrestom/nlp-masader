const url = "https://sheets.googleapis.com/v4/spreadsheets/1YO-Vl4DO-lnp8sQpFlcX1cDtzxFoVkCmU1PVw_ZHJDg?key=AIzaSyC6dSsmyQw-No2CJz7zuCrMGglNa3WwKHU&includeGridData=true";
function reformat_numbers(num) {
    if (num === undefined)
        return ''
    values = num.split(',')
    if (values.length < 2) {
        return num
    } else if (values.length == 2) {
        return values[0] + 'K'
    } else
        return values[0] + 'M'
}

function reformat_dialect(dialect)
{
    
    if (dialect.trim() != 'other')
    {
        dialect = dialect.split(':')[0]
        dialect = dialect.split('-')[1]
    }
    
    return dialect
}

function reformat_tasks(tasks)
{
    let out_html = ''

    tasks = tasks.split(',')
    for(let j = 0 ; j < tasks.length ; j += 1){
        out_html += tasks[j]+'</br>'
    }

    return out_html
}

function createHtml(i)
{
    let div = '<div style="font-family: Cairo, "Open Sans"> '
    let table = '<table style="border-collapse: collapse; border: none;">'
    let html_out = div + table 
    let list_to_show = ['Name', 'Year','Dialect', 'Volume', 'Tasks']
    for(let j = 0 ; j < list_to_show.length ; j += 1){

        let index_to_header = headersWhiteList.indexOf(list_to_show[j])
        let header = headersWhiteList[index_to_header]
        let value = ' ' +dataset[i][index_to_header]
        html_out += '<tr style="border: none;">'
        html_out += '<td style="border: none;">'
        html_out += '<b>'+header+'</b>'
        html_out += '</td>'
        html_out += '<td style="border: none;">'
        
        if(header == 'Volume')
        {
            html_out += reformat_numbers(value)+ ' '+ dataset[i][index_to_header+1]
        }
        else if (header == 'Name')
        {
            html_out += `<a href = "">${value}</a>`
        }
        else if (header == 'Dialect')
        {
            html_out += reformat_dialect(value)
        }
        else if (header == 'Tasks'){
            html_out += reformat_tasks(value)
        }
        else
        {
            html_out += value
        }
        
        html_out += '</td>'
        html_out += '</tr>'
    }

    return html_out+'</table>'+'</div>'
}
axios.get(url, ).then(function(response) {
    let rowData = response.data.sheets[0].data[0].rowData
    let headers = []
    headersWhiteList = ['Name', 'Link', 'License', 'Year', 'Language', 'Dialect', 'Domain', 'Form', 'Volume', 'Unit', 'Ethical Risks', 'Script', 'Access', 'Tasks', 'Venue Type']
    $('.loading-spinner').hide()
    
    // Grabbing header's index's to help us to get value's of just by header index 
    rowData[1].values.filter(header => header.formattedValue != undefined).forEach((header, headerIndex) => {
        if (headersWhiteList.includes(header.formattedValue)){
            headers.push({
                index: headerIndex,
                title: header.formattedValue
            })
        }
    })

    // console.log(headers)
    let tempRows = []
    rowData.filter(row => {
        tempRows.push(row.values)
    })
    
    // Grabbing row's values
    let rows = []
    for (let index = 2; index < tempRows.length; index++) {
        const fileds = tempRows[index]
        if (fileds != undefined) {
            // if (!isNaN(fileds[0].formattedValue)){
                rows.push(fileds)
            // }
        }
        
    }
    
        //  Createing table data
        dataset = []
        for (let index = 0; index < rows.length; index++) {
            const row = rows[index];
            let entry = {}
            if (isNaN(row[0].formattedValue))
            {
                continue
            }
            for (let index = 0; index < headersWhiteList.length; index++) {
                entry[index] = row[headers[index].index].formattedValue
            }
            dataset.push(entry)
        }
        console.log(dataset[0])
            var embeddings = {"data":[[27.2814178467,18.6026878357],[13.0607776642,21.9904556274],[20.4398078918,14.720533371],[13.9343471527,15.578166008],[10.9567375183,22.4609336853],[19.5411167145,26.1184387207],[19.0509090424,23.7479190826],[12.4456510544,21.8096427917],[16.4260540009,8.0812005997],[26.1514778137,23.3927745819],[20.5910148621,31.2567710876],[26.8691291809,20.0570640564],[12.6404628754,21.3494606018],[12.1770515442,10.8807992935],[27.3451328278,16.2587490082],[15.9004058838,19.8992595673],[28.2091369629,14.4370994568],[11.5103702545,14.1950836182],[12.8344526291,19.9541339874],[19.2943153381,32.9405136108],[14.1018848419,35.4208602905],[18.8566703796,9.1265716553],[25.281047821,27.5093078613],[13.7744483948,7.4623470306],[18.5062980652,15.3640918732],[24.588766098,27.7064189911],[23.7841567993,28.8095626831],[17.6599655151,37.0607070923],[24.4164772034,24.2874679565],[30.4625854492,15.6074943542],[30.4612884521,15.6108093262],[29.4684906006,15.8806886673],[28.8377761841,17.2241439819],[27.7384853363,15.2681369781],[29.4701690674,15.8785142899],[17.362247467,18.3429374695],[14.5812530518,18.4953479767],[25.5117301941,18.2835483551],[20.1805267334,35.6272201538],[27.5751514435,18.1858901978],[25.6481609344,20.1251316071],[25.9078369141,14.9996566772],[23.7738113403,26.3194732666],[25.2052001953,30.2644252777],[28.5976295471,18.2595348358],[22.5121879578,22.8052024841],[12.2133922577,28.4385757446],[20.2294139862,32.4365653992],[21.4029273987,33.4258422852],[22.3860473633,12.8689374924],[22.4823474884,12.8209047318],[10.9954490662,4.5213823318],[19.213804245,11.6281147003],[22.8811092377,25.0357322693],[24.4961719513,27.1473655701],[20.1284790039,13.3974227905],[24.1855354309,20.3492393494],[28.4489479065,12.5337848663],[9.6513566971,8.9418287277],[26.1124305725,32.1520805359],[10.8307170868,10.9082098007],[28.1585159302,33.8543891907],[11.716794014,6.6242055893],[29.717502594,33.5562286377],[18.0296230316,33.0188293457],[28.6479606628,33.3025817871],[27.7980575562,22.8009681702],[17.094291687,17.8994846344],[28.1732387543,21.7824802399],[21.7432556152,25.761724472],[11.8254909515,3.1050224304],[26.2035369873,32.1609954834],[13.01375103,18.3831367493],[30.9077968597,22.6880550385],[28.7022705078,33.1317100525],[24.2547740936,23.9888839722],[13.794002533,20.68242836],[16.0200996399,7.0257663727],[11.3519048691,9.0735759735],[10.7642555237,9.7876462936],[7.5191574097,10.5672607422],[32.0203552246,20.8967285156],[12.8341331482,19.9534759521],[12.6154546738,16.3144931793],[13.35455513,16.518032074],[20.5236816406,13.8251438141],[26.0942687988,19.3955078125],[20.8691654205,18.6266841888],[13.3957767487,17.5483989716],[15.1007137299,20.9537506104],[26.7483768463,13.1955385208],[14.1179733276,35.3707122803],[13.3641395569,34.6981964111],[12.0233516693,20.972492218],[22.6570014954,26.5120830536],[19.4758090973,24.1557693481],[20.2317829132,23.2921829224],[14.3864955902,17.7009887695],[16.2188053131,10.1739053726],[21.8346004486,28.9057712555],[17.1209812164,28.1220207214],[14.2409133911,19.4565258026],[14.2421035767,19.4576034546],[22.8877353668,27.1784286499],[29.2930526733,12.0548639297],[17.915397644,24.5291748047],[9.5550441742,11.2174844742],[16.2312526703,20.7908916473],[10.7656698227,9.7878913879],[26.3045139313,22.1679096222],[30.3683738708,14.1154003143],[15.3187179565,36.610042572],[19.4443759918,22.0623683929],[26.3205890656,26.909570694],[15.4925956726,35.7242965698],[25.5232639313,26.3495483398],[18.0197887421,29.8874950409],[22.361831665,36.1073188782],[22.3612651825,36.1071777344],[18.7896194458,38.5263290405],[16.4769115448,36.5689849854],[29.7061462402,25.4361820221],[16.0066986084,37.7381057739],[29.8171672821,34.6258773804],[28.8005599976,20.0349826813],[19.4858036041,35.8025741577],[21.5911846161,26.9436473846],[10.0290250778,4.7157640457],[12.0074806213,17.4123668671],[12.7597999573,17.5163955688],[18.3679084778,23.1392555237],[18.5058250427,15.3647480011],[23.7179660797,33.9619407654],[15.6224365234,15.9832401276],[15.6222896576,15.9831190109],[16.4178028107,7.4020652771],[30.1222457886,22.1184654236],[29.0899391174,31.9305381775],[13.5000085831,13.0323877335],[22.1946983337,31.8147277832],[15.3476219177,17.7535820007],[10.9197998047,16.2680778503],[11.1577396393,4.2287845612],[22.395570755,0.3480911255],[25.0586853027,19.8799209595],[17.4501972198,33.4965896606],[15.6241416931,32.6704521179],[16.2378158569,34.1091766357],[16.3352012634,34.500541687],[29.4772148132,25.9592018127],[14.3604211807,37.5186309814],[11.3220891953,29.8878746033],[33.1983451843,18.6089324951],[32.9297409058,18.5960063934],[18.2926864624,7.47356987],[28.2887535095,22.5648422241],[11.6859111786,6.7300109863],[24.6127796173,26.2730331421],[21.3105678558,33.3564987183],[18.2918262482,28.627746582],[24.8613357544,16.527141571],[27.911939621,26.7339859009],[10.9020729065,18.5678062439],[18.05809021,10.050860405],[20.9754447937,30.2453422546],[32.3608131409,19.1156520844],[26.0719928741,25.2016429901],[15.2383213043,18.8559341431],[26.8863697052,28.5407543182],[26.559135437,16.7824020386],[10.9454441071,32.9342918396],[21.0780143738,27.690946579],[16.6310043335,10.0339078903],[27.4527397156,29.2179031372],[17.9836750031,35.4250793457],[31.3603572845,11.4054365158],[31.3601303101,11.4053621292],[7.5081796646,10.4136228561],[17.489572525,13.2829942703],[27.0453224182,13.2328281403],[13.0913925171,13.0825901031],[17.0421714783,5.1233062744],[14.2648744583,38.0878295898],[12.996260643,35.8262062073],[15.5430173874,6.3994398117],[16.0534667969,30.5522575378],[10.9572963715,19.1445407867],[28.8872280121,27.5596961975],[23.4852333069,1.5373039246],[28.8951950073,35.4823913574],[14.8916864395,21.5547733307],[14.5503635406,7.310839653],[30.6159172058,33.9170913696],[16.3686962128,38.934677124],[8.202044487,15.5586986542],[8.3310079575,15.6520738602],[11.2659893036,29.9760055542],[24.7936115265,30.6266307831],[14.573756218,31.7651634216],[14.8016204834,34.2175254822],[23.6810512543,0.2672615051],[22.7737369537,1.5799560547],[26.4197807312,25.1455154419],[12.216542244,28.4858932495],[23.8921794891,0.9495105743],[23.0186595917,0.0],[23.0760154724,0.8203773499],[22.288230896,1.054315567],[11.7092905045,14.1972503662],[14.5400886536,8.4854755402],[24.5880947113,20.9644126892],[14.4353256226,6.252281189],[13.2422180176,24.3163661957],[17.1619129181,36.7992477417],[10.7935161591,13.6695985794],[10.3530035019,10.7374410629],[15.8050260544,8.4436569214],[17.5052242279,11.9200744629],[8.5884246826,9.6807346344],[20.8957633972,18.6340198517]]}
            var clusters = {"data":[[5],[3],[0],[3],[3],[7],[7],[3],[8],[2],[7],[2],[3],[9],[5],[3],[5],[9],[3],[4],[4],[0],[2],[8],[0],[7],[7],[4],[2],[5],[5],[5],[5],[5],[5],[3],[3],[5],[4],[5],[2],[5],[7],[1],[5],[7],[4],[4],[1],[0],[0],[8],[0],[7],[7],[0],[2],[5],[9],[1],[9],[1],[8],[1],[4],[1],[2],[3],[2],[7],[8],[1],[3],[2],[1],[2],[3],[8],[9],[9],[9],[5],[3],[3],[3],[0],[5],[0],[3],[3],[5],[4],[4],[3],[7],[7],[7],[3],[8],[7],[7],[3],[3],[7],[5],[7],[9],[3],[9],[2],[5],[4],[7],[2],[4],[2],[7],[1],[1],[4],[4],[2],[4],[1],[5],[4],[7],[8],[3],[3],[7],[0],[1],[3],[3],[8],[2],[1],[9],[1],[3],[3],[8],[6],[2],[4],[4],[4],[4],[2],[4],[4],[5],[5],[8],[2],[8],[2],[1],[7],[5],[2],[3],[0],[7],[5],[2],[3],[2],[5],[4],[7],[8],[1],[4],[5],[5],[9],[0],[5],[9],[8],[4],[4],[8],[4],[3],[2],[6],[1],[3],[8],[1],[4],[9],[9],[4],[1],[4],[4],[6],[6],[2],[4],[6],[6],[6],[6],[9],[8],[2],[8],[3],[4],[9],[9],[8],[0],[9],[0]]}

            const width = 1000;
            const height = 500;

            var svg = d3.select('svg');  
            var dimension = document.body
                .getBoundingClientRect();
            
            var tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("z-index", "10")
            .style("visibility", "hidden")
            ;

            var data = d3.range(0, 220).map(function (d) {
                return {
                x: embeddings['data'][d][1],
                y: embeddings['data'][d][0]
              }
            });

            var x = d3.scaleLinear()
            .domain([-3, 40])
            .range([ 0, width ]);

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, 40])
                .range([ height, 0]);

            
            var zoom = d3.zoom()
                .scaleExtent([.5, 10])  // This control how much you can unzoom (x0.5) and zoom (x20)
                .extent([[0, 0], [width, height]])
                .on("zoom", updateChart);
          
            var svg = d3.select("svg")
                .attr('width', width)
                .attr('height', height)
                .attr("style", "outline: thin solid gray;")
                .call(zoom)                       // Adds zoom functionality

            var canvas = svg
                .append("g")
                .attr("class", "zoomable")
            
              function updateChart() {
                if (canvas) {
                    canvas.attr("transform", d3.event.transform);
                    // recover the new scale
                    var newX = d3.event.transform.rescaleX(x);
                    var newY = d3.event.transform.rescaleY(y);
                
                
                    // update circle position
                    canvas.selectAll("circle")
                        .attr('cx', function(d) {return newX(d.x)})
                        .attr('cy', function(d) {return newY(d.y)});
                }
              }

            canvas.selectAll('circle')
                .data(data)
                .enter()
                .append('circle')
                .attr("r", function(_, i, n){
                    let vol_index = headersWhiteList.indexOf('Volume')
                    if(dataset[i][vol_index] === undefined)
                        return 10
                    let volume = parseInt(dataset[i][vol_index].replaceAll(",",""))
                    return Math.log(volume)
                }) 
                .attr('opacity', 0.7)
                .attr('cx', function(d) {
                    return x(d.x);})
                .attr('cy', function(d) {
                    return y(d.y)})
                .style('fill', function(_, i, n) {
                    const index = clusters['data'][i][0]
                    return d3.schemeCategory10[index]
                }).on("mouseover", function(_, i, n){                    
                    tooltip = tooltip.html(createHtml(i));
                    d3.select(this).style('stroke', '#eaeaea')
                    d3.select(this).style('stroke-width', '5')
                    return tooltip.style("visibility", "visible");
                })
                .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
                .on("mouseout", function(){
                    d3.select(this).style('stroke', 'white')
                    d3.select(this).style('stroke-width', '0')
                    return tooltip.style("visibility", "hidden");
                })
                .on("click", function(_, i, n){
                    let url = 'card.html?'+i;
                    window.open(url, '_blank').focus();
                });


    })
    .catch(function(error) {
        console.log(error);
    });

            