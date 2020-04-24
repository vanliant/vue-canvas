<template>
    <div id="canvas" :style="{height:divHeight + 'px'}">
        <canvas id="myCanvas" ref="myCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>
    </div>
</template>

<script>
export default {
    data(){
        return {
            canvasWidth:0,
            canvasHeight:0,

            dataList:[
                {startDate:'2020-01-06',endDate:'2020-01-10',type:'node',content:'内容1',title:'节点1'},
                {startDate:'2020-01-09',endDate:'2020-01-09',type:'node',content:'',title:'节点1'},
                {startDate:'2020-03-25',endDate:'2020-03-25',type:'node',content:'',title:'节点1'},
                {startDate:'2020-04-21',endDate:'2020-04-23',type:'node',content:'',title:'节点1'},
                {startDate:'2020-04-16',type:'week',content:'',title:'16周'},
                {startDate:'2020-04-23',type:'week',content:'',title:'17周'},
            ],

        }
    },
    computed:{
        divHeight:function(){
            return document.body.offsetHeight-100
        }
    },
    watch:{
        canvasWidth:function(){
            this.$nextTick(()=>{
                this.drawCanvas()
            })
    }
    },
    methods:{
        // 绘制canvas
        drawCanvas(){
            this.canvas = this.$refs.myCanvas
            this.ctx = this.canvas.getContext('2d')
            this.ctx.fillStyle = '#f6f6f6'
            this.ctx.fillRect(0,0,this.canvasWidth,this.canvasHeight);
        },

        // 绘制中间线条
        drawLine(){
            this.canvas = this.$refs.myCanvas
            this.ctx = this.canvas.getContext('2d')
            this.ctx.beginPath();
            this.ctx.strokeStyle="#e8ebef";
            this.ctx.moveTo(0,this.canvasHeight/2);
            this.ctx.lineTo(this.canvasWidth,this.canvasHeight/2);
            this.ctx.lineWidth=10
            this.ctx.lineCap="round";
            this.ctx.stroke();

            this.drawStatusLine()
        },

        // 绘制状态条
        drawStatusLine(){
            this.canvas = this.$refs.myCanvas
            this.ctx = this.canvas.getContext('2d')
            this.ctx.beginPath();
            this.ctx.strokeStyle="#f56c6c";
            this.ctx.moveTo(100,this.canvasHeight/2);
            this.ctx.lineTo(this.canvasWidth,this.canvasHeight/2);
            this.ctx.lineWidth=10
            this.ctx.lineCap="round";
            this.ctx.stroke();
        }
    },
    mounted(){
        this.canvasWidth = document.getElementById('canvas').offsetWidth -100
        this.canvasHeight = this.divHeight

        this.$nextTick(()=>{
            this.drawCanvas()
            this.$nextTick(()=>{
                    this.drawLine()
                })
        })

        window.onresize = () => {
            this.canvasWidth = document.getElementById('canvas').offsetWidth -100
            this.canvasHeight = this.divHeight
            this.$nextTick(()=>{
                this.drawCanvas()
                this.$nextTick(()=>{
                    this.drawLine()
                })
            })
        }

            
    }
}
</script>

<style lang="less" scoped>
#canvas{
    padding: 50px;
}
</style>