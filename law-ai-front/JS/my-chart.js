const Form_App = {
    data() {
        return {
            surgeryFee: 0,
            medicalFee: 0,
            total: 0,
            count: 0,
            costumeInput:false,
            percentage:0,
            range_count:[],
            maxStep: 20,
            stepLabel: [],
            step: 100000,
            afforded:0,
            myChart:{},
            selectedCompany:'',
            companyList:['台灣人壽', '元大人壽', '遠雄人壽','全球人壽'],
            projectList:[],
            selectedProject:'',
            result: false,
            p_index: 0
        };
    },
    methods: {
        getData(){
            const apiUrl_project = 'https://laws-project-wv4ds.ondigitalocean.app/apis/insurance?limit=12';
            axios.get(apiUrl_project)
            .then((res) => {
                // console.log(res.data)
                res.data.results.forEach( project => {
                    this.projectList.push(project)
                })
                this.addProjectList()
            })
            .catch((err) => {
                console.log(err.response);
            })
            const apiUrl_chart = 'https://laws-project-wv4ds.ondigitalocean.app/apis/summary/med_cost_chart';
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
            var temp = this.projectList.splice(11)
            console.log(temp)
            // this.projectList[10] = this.projectList[11]
            // this.projectList[11] = temp
            this.projectList.splice(9,0,temp[0])
            console.log(this.projectList)
        },

        //組距
        pushGroup(group){
            this.range_count.push(group.count)
        },

        //其他數據(label、總數)
        calCount(){
            const reducer = (accumulator, currentValue) => accumulator + currentValue;
            this.count = this.range_count.reduce(reducer)
            // console.log("all " + this.count)

            temp = this.range_count.splice(this.maxStep)
            this.range_count.push(temp.reduce(reducer))
            // console.log(this.range_count)

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

        // 算錢
        calTotal(){
            this.total = this.medicalFee + this.surgeryFee;
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
                    borderColor: '#2f439d',
                    backgroundColor: '#2f439d66',
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
            const apiUrl = 'https://laws-project-wv4ds.ondigitalocean.app/apis/summary/med_cost?gte='+this.total.toString();
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
                    backgroundColor: '#ffb900AA',
            };
            const leftData={
                label: '法院判決案件數',
                data: left_count,
                backgroundColor: '#2f439d66',
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

        updateProjectList(){

            this.surgeryFee = 0
            this.medicalFee = 0 
            if(this.selectedProject)
                this.selectedCompany = ''
            switch(this.selectedCompany){
                case this.companyList[0]:
                    this.p_index = 0
                    break;
                case this.companyList[1]:
                    this.p_index = 3

                    break;
                case this.companyList[2]:
                    this.p_index = 6

                    break;
                case this.companyList[3]:
                    this.p_index = 9

                    break;
            }
        },
        

        setInsurance(){
            console.log(this.selectedProject)
            var index
            switch(this.selectedProject){
                case this.projectList[0].name+this.projectList[0].plan:
                    index = 0;
                    this.medicalFee = this.projectList[index].miscellaneous_charge
                    this.surgeryFee = this.projectList[index].surgery_fee
                    break
                case this.projectList[1].name+this.projectList[1].plan:
                    index = 1;
                    this.medicalFee = this.projectList[index].miscellaneous_charge
                    this.surgeryFee = this.projectList[index].surgery_fee
                    break
                case this.projectList[2].name+this.projectList[2].plan:
                    index = 2;
                    this.medicalFee = this.projectList[index].miscellaneous_charge
                    this.surgeryFee = this.projectList[index].surgery_fee
                
                    break
                case this.projectList[3].name+this.projectList[3].plan:
                    index = 3;
                    this.medicalFee = this.projectList[index].miscellaneous_charge
                    this.surgeryFee = this.projectList[index].surgery_fee
                
                    break
                case this.projectList[4].name+this.projectList[4].plan:
                    index = 4;
                    this.medicalFee = this.projectList[index].miscellaneous_charge
                    this.surgeryFee = this.projectList[index].surgery_fee
                
                    break
                case this.projectList[5].name+this.projectList[5].plan:
                    index = 5;
                    this.medicalFee = this.projectList[index].miscellaneous_charge
                    this.surgeryFee = this.projectList[index].surgery_fee
                
                    break
                case this.projectList[6].name+this.projectList[6].plan:
                    index = 6;
                    this.medicalFee = this.projectList[index].miscellaneous_charge
                    this.surgeryFee = this.projectList[index].surgery_fee
                
                    break
                case this.projectList[7].name+this.projectList[7].plan:
                    index = 7;
                    this.medicalFee = this.projectList[index].miscellaneous_charge
                    this.surgeryFee = this.projectList[index].surgery_fee
                
                    break
                case this.projectList[8].name+this.projectList[8].plan:
                    index = 8;
                    this.medicalFee = this.projectList[index].miscellaneous_charge
                    this.surgeryFee = this.projectList[index].surgery_fee
                
                    break
                case this.projectList[9].name+this.projectList[9].plan:
                    index = 9;
                    this.medicalFee = this.projectList[index].miscellaneous_charge
                    this.surgeryFee = this.projectList[index].surgery_fee
                
                    break
                case this.projectList[10].name+this.projectList[10].plan:
                    index = 10;
                    this.medicalFee = this.projectList[index].miscellaneous_charge
                    this.surgeryFee = this.projectList[index].surgery_fee
                
                    break
                case this.projectList[11].name+this.projectList[11].plan:
                    index = 11;
                    this.medicalFee = this.projectList[index].miscellaneous_charge
                    this.surgeryFee = this.projectList[index].surgery_fee
                
                    break

            }

            
            
        },
    },
    


    watch: {
        medicalFee() {
            this.calTotal();
        },
        surgeryFee() {
            this.calTotal();
        },
        selectedCompany(){
            this.updateProjectList();
        },
        selectedProject(){
            this.setInsurance();
        },
        costumeInput(){
            this.surgeryFee = 0
            this.medicalFee = 0
        }
    },

    created() {
        this.getData();
    },

    mounted() {
        
    },

};

Vue.createApp(Form_App).mount('#section-form');