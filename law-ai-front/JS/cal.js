const Form_App = {
    data() {
        return {
            surgeryFee: 0,
            medicalFee: 0,
            total: 0,
            flagSurgery:1,
            disableSurgery: false
        };
    },
    methods: {
        getData(){
            const apiUrl = 'https://laws-project-wv4ds.ondigitalocean.app/apis/judgements/';
            axios.get(apiUrl)
            .then((res) => {
                // 取得遠端資料
                console.log(res);
                // this.datastore = res.data.result.records;
            })
            .catch((err) => {
                console.log(err.response);
            })
        },
        calTotal(){
            this.total = this.medicalFee + this.surgeryFee;
        }
    },
    
    watch: {
        medicalFee() {
            // console.log('medical: ' + this.medicalFee);
            this.calTotal();
        },
        surgeryFee() {
            console.log('surgery: ' + this.surgeryFee);
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

};

Vue.createApp(Form_App).mount('#form-app');