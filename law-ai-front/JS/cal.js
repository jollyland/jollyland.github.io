const Form_App = {
    data() {
        return {
            surgeryFee: 0,
            medicalFee: 0,
            total: 0,
            flagSurgery:1,
            disableSurgery: false,

            count: 0,
            cost_data:[]
        };
    },
    methods: {
        getData(){
            const apiUrl = 'https://laws-project-wv4ds.ondigitalocean.app/apis/summary/med_cost?gte=1';
            axios.get(apiUrl)
            .then((res) => {
                // 取得遠端資料
                // console.log(res.data.data.details);
                this.count = res.data.data.count;
                res.data.data.details.forEach( (detail) => {
                    this.pushCost(detail);
                });
                console.log(this.cost_data)
            })
            .catch((err) => {
                console.log(err.response);
            })
        },
        calTotal(){
            this.total = this.medicalFee + this.surgeryFee;
        },

        pushCost(detail){
            this.cost_data.push(detail.med_cost);
        },



        drawChart(){
            // console.log("hi?");
            // var ctx = document.getElementById('myChart');
            // var myChart = new Chart(ctx, {
            //     type: 'bar',
            //     data: {
            //         labels: ['10000', '30000', '50000', '70000', '90000'],
            //         datasets: [{
            //         label: '理賠案件數',
            //         data: [88, 68, 72, 66, 27, 10]
            //     }]
            //     }
            // });
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
        flagSurgery() {
            if(this.flagSurgery=='1'){
                this.disableSurgery = false;
            }
            else
            {
                this.disableSurgery = true;
                this.surgeryFee=0;
            }
        }
    },

    created() {
        this.getData();
    },

    mounted() {
        this.drawChart();
        
    },

};

Vue.createApp(Form_App).mount('#form-app');