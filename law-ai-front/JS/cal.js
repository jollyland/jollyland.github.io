const Form_App = {
    data() {
        return {
            surgeryFee: 0,
            medicalFee: 0,
            total: 0,
            interval : 100000,
            count: 0,
            cost_data:[],
            temp:[],
            group:0,
            arrange_data:[],
            cases : [],
            result:false,
            percentage:0
        };
    },
    methods: {
        getData(){
            const apiUrl = 'https://laws-project-wv4ds.ondigitalocean.app/apis/summary/med_cost?gte=1';
            axios.get(apiUrl)
            .then((res) => {
                // 取得遠端資料
                this.count = res.data.data.count;
                res.data.data.details.forEach( detail => {
                    this.pushCost(detail);
                });
                // console.log(this.cost_data)
                this.preChart()
                this.drawChart();
                
            })
            .catch((err) => {
                console.log(err.response);
            })
        },

        calTotal(){
            this.total = this.medicalFee + this.surgeryFee;
        },

        pushCost(detail){
            this.cost_data.push(detail.med_cost)

            if(detail.med_cost <= this.interval*10){
                if( Math.floor(detail.med_cost/this.interval) <= this.group ){
                    this.temp.push(detail.med_cost)
                }
                else{
                        while(Math.floor(detail.med_cost/this.interval) > this.group+1){
                            this.group += 1
                            this.arrange_data.push(this.temp)
                            this.temp = []
                        }
                        this.group += 1
                        this.arrange_data.push(this.temp)
                        this.temp = []
                }
            }
            else
                this.temp.push(detail.med_cost)

        },

        preChart(){
            this.arrange_data.push(this.temp)
            this.arrange_data.forEach(group => {
                this.cases.push(group.length)
            }) 
        },


        drawChart(){
            var ctx = document.getElementById('myChart');
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: [
                            {
                            label: "法院判決案件數",
                            data: this.cases,
                            borderColor: '#2f439d',
                            backgroundColor: '#2f439d66',
                            // this dataset is drawn below
                            order: 2
                        }, 
                    ],
                    labels: ['$0', '$100000', '$200000', '$300000', '$400000', '$500000', '$600000', '$700000', '$800000', '$900000', '$1000000'],
            
                },
                scales: {
                    y: { // defining min and max so hiding the dataset does not change scale range
                    min: 0,
                    max: 200
                    }
                }
            });
        },

        updateChart(){
            this.result = true
            if(this.total > 1000000){

            }
            else{
                var g = Math.floor(this.total / this.interval)
                var c = 0
                for(i=0; i<g; i++){
                    c += this.cases[i]
                }
            console.log(c)

                i=0
                while(this.total > this.arrange_data[g][i]){
                    c++;
                    i++;
                }
            }
            console.log(c)
            this.percentage = (c/this.count*100).toFixed(2);
            console.log("update")
            var ctx = document.getElementById('myChart');
            var afford_index =Math.floor( this.total/this.interval) 
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: [
                            {
                            label: "法院判決案件數",
                            data: this.cases,
                            borderColor: '#2f439d',
                            backgroundColor: '#2f439d66',
                            // this dataset is drawn below
                            order: 2
                        }, 
                        {
                            label: "您的保險所能負擔之案件",
                            // data: [1000,1000],
                            data: this.cases.slice(0,afford_index+1),
                            backgroundColor: '#ffb900AA',
                            // this dataset is drawn on top
                            order: 1
                    }
                    ],
                    labels: ['$0', '$100000', '$200000', '$300000', '$400000', '$500000', '$600000', '$700000', '$800000', '$900000', '$1000000'],
            
                },
                scales: {
                    y: { // defining min and max so hiding the dataset does not change scale range
                    min: 0,
                    max: 200
                    }
                }
            });
        }
    },
    
    watch: {
        medicalFee() {
            // console.log('medical: ' + this.medicalFee);
            this.calTotal();
        },
        surgeryFee() {
            // console.log('surgery: ' + this.surgeryFee);
            this.calTotal();
        },
    },

    created() {
        this.getData();
    },

    mounted() {
        
    },

};

Vue.createApp(Form_App).mount('#section-form');