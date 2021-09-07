const Form_App = {
    data() {
        return {
            total: 0,
            count: 0,
            percentage:0,
            range_count:[],
            maxStep: 20,
            stepLabel: [],
            step: 100000,
            afforded:0,
            myChart:{},
            projectList:[],
            selectedProject:0,
            result: false
        };
    },
    methods: {
        getData(){
            
            const apiUrl_chart = 'https://laws-project-wv4ds.ondigitalocean.app/apis/summary/compensate_chart';
            axios.get(apiUrl_chart)
            .then((res) => {
                // 取得遠端資料
                res.data.data.forEach( group => {
                    this.pushGroup(group);
                } )
                this.calCount()
                this.drawChart();
                
            })
            .catch((err) => {
                console.log(err.response);
            })
        },

        addProjectList(){
        },

        //組距
        pushGroup(group){
            this.range_count.push(group.count)
        },

        //其他數據(label、總數)
        calCount(){
            const reducer = (accumulator, currentValue) => accumulator + currentValue;
            this.count = this.range_count.reduce(reducer)

            temp = this.range_count.splice(this.maxStep)
            this.range_count.push(temp.reduce(reducer))

            for (i=0; i<=this.maxStep; i++){
                if(i == 0){
                    this.stepLabel.push('10萬以下')
                }
                else if(i ==this.maxStep){
                    labelString = (i*10).toString()+"萬以上"
                    this.stepLabel.push(labelString)
                }
                else{
                    labelString = (i*10).toString()+"萬~"+(i*10+10).toString()+"萬"
                    this.stepLabel.push(labelString)
                }
            }

        },


        //一進頁面畫
        drawChart(){
            var ctx = document.getElementById('myChart');
            const labels = this.stepLabel;
            const data = {
                labels: labels,
                datasets: [{
                    label: '法院判決案件數',
                    data: this.range_count,
                    borderColor: '##ff2600',
                    backgroundColor: '#ff260066',
                }]
            };

            const config = {
                type: 'bar',
                data: data,
                options: {
                    scales:{
                        xAxes: [{
                            stacked: true
                        }],
                        yAxes: [{
                        stacked: true
                        }]
                    }
                }
            };

            this.myChart = new Chart(ctx, config);
        },

        //表單更新圖表
        updateChart(){
            const apiUrl = 'https://laws-project-wv4ds.ondigitalocean.app/apis/summary/compensate?gte='+this.total.toString();
            axios.get(apiUrl)
            .then((res) => {
                // 取得遠端資料
                this.afforded = this.count - res.data.data.count        
                this.result = true;
                this.percentage = (this.afforded/this.count*100).toFixed(2)
                console.log(this.count, "-", res.data.data.count,'=',this.afforded)
                this.addData(this.myChart, this.afforded)
            })
            .catch((err) => {
                console.log(err.response);
            })
        },

        //更新圖表上的資料
        addData(chart, cases) {
            var i=0;
            var afforded_count=[]
            var left_count=[]
            console.log(this.range_count[i])
            console.log(cases)
            for (i=0; i<=this.maxStep; i++){
                if(cases == 0){
                    afforded_count.push(0)
                    left_count.push(this.range_count[i])
                
                }
                else{
                    if(cases>this.range_count[i]){
                        afforded_count.push(this.range_count[i])
                        left_count.push(0)
                        cases -= this.range_count[i]
                    }
                    else{
                        afforded_count.push(cases)
                        left_count.push(this.range_count[i]-cases)
                        cases = 0
                    }

                }
            }
            console.log(afforded_count)            
            console.log(left_count)         


            const newData = {
                    label: '保險可負擔案件數',
                    data: afforded_count,
                    backgroundColor: '#3474e3',
            };
            const leftData={
                label: '法院判決案件數',
                data: left_count,
                backgroundColor: '#ff260088',
            };

            if(Object.keys(chart.data.datasets).length==1){
                chart.data.datasets.push(newData)
                chart.data.datasets.push(leftData)
                chart.data.datasets.shift()
                
            }
            else{
                chart.data.datasets.push(newData)
                chart.data.datasets.push(leftData)
                chart.data.datasets.shift()  
                chart.data.datasets.shift()  
            }
            console.log(chart.data.datasets)
            chart.update();
        },


    },
    


    watch: {
        selectedProject(){
            console.log(this.selectedProject)
        }
    },

    created() {
        this.getData();
    },

};

Vue.createApp(Form_App).mount('#section-compensate');