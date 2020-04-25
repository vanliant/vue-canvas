<template>
    <div id="canvas" :style="{height:divHeight + 'px'}">
        <!-- 设置日期的偏移以及显示 -->
        <div class="detail-date" v-if="dataList[0].dateContent && dataList[0].config">
            <div :class="item.important ? 'detail-date-content importantDate' : 'detail-date-content normalDate' " v-for="(item,index) in dataList" :key='index' :style="{left:item.config.left +'px',top:item.config.top +'px'}">
                <span >{{item.dateContent}}</span>
            </div>
        </div>
        <!-- 设置节点框的偏移及显示 -->
        <div class="detail-node" v-if="dataList[0].dateContent && dataList[0].config">
            <!-- 节点框在下面计算top，在上面计算bottom -->
            <div :class="index%2 == 0 ? 'detail-node-div upNode' : 'detail-node-div'" v-for="(item,index) in dataList" :key='index' :style="{left:item.config.left +'px',top:item.config.nodePosition +'px',maxWidth:'200px'}">
                <div class="detail-node-title">
                    <div :class="checkChinese(item.title) ? 'with-chinese' : 'without-chinese'">
                        {{item.title}}
                    </div>
                </div>
                <div class="detail-node-content">
                    <div :class="checkChinese(item.content) ? 'with-chinese' : 'without-chinese'">
                        {{item.content}}
                    </div>
                </div>
            </div>
        </div>
        <canvas id="myCanvas" ref="myCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>
    </div>
</template>

<script>
import {dateLength} from '@/utils/day.js'


export default {
    data(){
        return {
            canvasWidth:0,
            canvasHeight:0,

            dataList:[
                {startDate:'2020-01-06',endDate:'2020-01-10',type:'node',content:'内容3211sssssssssssssssssssssssssssssssssssaa',title:'节点1',important:true},
                // {startDate:'2020-01-08',endDate:'2020-01-08',type:'node',content:'dddddddd',title:'aa',important:false},
                {startDate:'2020-01-09',endDate:'2020-01-09',type:'node',content:'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',title:'节点2',important:false},
                {startDate:'2020-01-14',endDate:'2020-02-02',type:'node',content:'dwqdqdwdad大多数',title:'BBac额',important:true},
                {startDate:'2020-02-13',endDate:'2020-02-17',type:'node',content:'dddasdasdc啊哈啥',title:'BBac额',important:false},
                {startDate:'2020-03-25',endDate:'2020-03-25',type:'node',content:'dwqdqdwdad大多数',title:'节点4',important:true},
                {startDate:'2020-04-21',endDate:'2020-04-23',type:'node',content:'dwqdqdwdad大多数',title:'BBac额',important:false},
                
                // {startDate:'2020-04-16',type:'week',content:'',title:'16周'},
                // {startDate:'2020-04-23',type:'week',content:'',title:'17周'},
            ],

            holidayList:[
                {holiday_name: "元旦", start_date: "2020-01-01", end_date: "2020-01-01"},
                {holiday_name: "除夕", start_date: "2020-01-24", end_date: "2020-01-24"},
                {holiday_name: "春节", start_date: "2020-01-25", end_date: "2020-01-30"},
                {holiday_name: "清明节", start_date: "2020-04-04", end_date: "2020-04-06"},
            ],
            
            minStep:0,//相邻最近的两个节点

            startDate:'',
            dayLength:0,
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
            this.getDayLength()

            this.getSiblingLength()

            // 处理content的偏移量
            this.handlePosition()

            this.canvas = this.$refs.myCanvas
            this.ctx = this.canvas.getContext('2d')
            this.ctx.fillStyle = '#f6f6f6'
            this.ctx.fillRect(0,0,this.canvasWidth,this.canvasHeight);

            this.$nextTick(()=>{
                this.drawLine()
            })
        },

        // 绘制中间线条
        drawLine(){

            
            this.canvas = this.$refs.myCanvas
            this.ctx = this.canvas.getContext('2d')

            // 先画节假日背景色
            this.holidayList.map((val)=>{
                val.left = dateLength(this.startDate,val.start_date)*this.dayLength + 150
                if(dateLength(this.startDate,val.start_date) > 0){
                    this.ctx.fillStyle="#fbf2e9";
                    this.ctx.fillRect(val.left,0,(dateLength(val.start_date,val.end_date)+1)*this.dayLength,this.canvasHeight);

                }
            })
            

            this.ctx.beginPath();
            this.ctx.strokeStyle="#e8ebef";
            this.ctx.moveTo(0,this.canvasHeight/2);
            this.ctx.lineTo(this.canvasWidth,this.canvasHeight/2);
            this.ctx.lineWidth=10
            this.ctx.lineCap="round";
            this.ctx.stroke();

            this.$nextTick(()=>{
                this.drawStatusLine()
            })
        },

        // 绘制状态条
        drawStatusLine(){
            this.canvas = this.$refs.myCanvas
            this.ctx = this.canvas.getContext('2d')

            // 绘制节假日
            let nameIndex = 0
            this.holidayList.map((val)=>{
                // 判断节假日的开始日期时候在第一个节点的开始日期之后
                
                if(dateLength(this.startDate,val.start_date) > 0){
                    nameIndex++
                    val.left = dateLength(this.startDate,val.start_date)*this.dayLength + 150
                    this.ctx.beginPath()
                    this.ctx.strokeStyle='#ffa92b'
                    this.ctx.moveTo(val.left+5,this.canvasHeight/2);
                    this.ctx.lineTo(val.left-5 + (dateLength(val.start_date,val.end_date)+1)*this.dayLength,this.canvasHeight/2);
                    this.ctx.lineWidth=10
                    this.ctx.lineCap="round";
                    this.ctx.stroke();

                    // 添加日期文字
                    this.ctx.font="14px Arial";
                    this.ctx.fillStyle='#666'
                    if(nameIndex%2 == 1){
                        this.ctx.fillText(val.holiday_name, val.left, this.canvasHeight/2 -30)
                    }else{
                        this.ctx.fillText(val.holiday_name, val.left, this.canvasHeight/2 +30)
                    }
                }
                
            })

            this.drawNode()
        },

        // 绘制节点
        drawNode(){
            this.canvas = this.$refs.myCanvas
            this.ctx = this.canvas.getContext('2d')
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = "#f67d7d";
            this.ctx.lineCap = "round";
            

            this.dataList.map((val,index)=>{
                val.left = dateLength(this.startDate,val.startDate)*this.dayLength + 150
                this.ctx.beginPath();
                this.ctx.strokeStyle='#f67d7d'
                this.ctx.arc(val.left, this.canvasHeight/2, 5, 0, 2 * Math.PI, false);
                this.ctx.stroke();

                if(index%2 == 0){
                    this.ctx.beginPath();
                    this.ctx.arc(val.left, this.canvasHeight/2-100, 5, 0, 2 * Math.PI, false);
                    this.ctx.stroke();

                    this.ctx.beginPath();
                    this.ctx.strokeStyle='#e8ebef'
                    this.ctx.moveTo(val.left,this.canvasHeight/2-6);
                    this.ctx.lineTo(val.left,this.canvasHeight/2-100+6);
                    this.ctx.lineWidth=2
                    this.ctx.lineCap="round";
                    this.ctx.stroke();
                }else{
                    this.ctx.beginPath();
                    this.ctx.arc(val.left, this.canvasHeight/2+100, 5, 0, 2 * Math.PI, false);
                    this.ctx.stroke();

                    this.ctx.beginPath();
                    this.ctx.strokeStyle='#e8ebef'
                    this.ctx.moveTo(val.left,this.canvasHeight/2+6);
                    this.ctx.lineTo(val.left,this.canvasHeight/2+100-6);
                    this.ctx.lineWidth=2
                    this.ctx.lineCap="round";
                    this.ctx.stroke();
                }
                
            })
            
        },

        // 获取后端返回数据中，所有节点的时间差
        getDayLength(){

            this.startDate = this.dataList[0].startDate

            let curArr = []
            this.dataList.map(value => {
                if(value.type == 'node'){
                    curArr.push(value.startDate)
                }
            })
            curArr.sort((a,b) => a-b)
            let canvasLength = dateLength(curArr[0],curArr[curArr.length-1])

            // 单天的长度
            this.dayLength = 90/this.minStep

            this.canvasWidth = canvasLength * this.dayLength +300
        },

        // 相邻最近的两个节点的距离为 时间长度的一半 90
        getSiblingLength(){
            let rangeArr = []
            this.dataList.map((value,index)=>{
                if(index+1 < this.dataList.length){
                    rangeArr.push(dateLength(value.startDate,this.dataList[index+1].startDate))
                }
            })

            rangeArr.sort((a,b)=>a-b)

            this.minStep = rangeArr[0]
        },

        handlePosition(){
            console.log(this.startDate,'..')
            this.dataList.map((val,index)=>{
                // 根据起始日期判断日期的显示内容
                if(dateLength(val.startDate,val.endDate) > 0){
                    val.dateContent = val.startDate.replace(/-/g,'.') + '-' + val.endDate.replace(/-/g,'.')
                }else{
                    val.dateContent = val.startDate.replace(/-/g,'.')
                }
                val.config = {}
                val.config.left = dateLength(this.startDate,val.startDate)*this.dayLength + 150
                if(index%2 == 1){
                    val.config.top = this.canvasHeight/2 -25

                    // 节点框在下面
                    val.config.nodePosition = this.canvasHeight/2 + 105
                }else{
                    val.config.top = this.canvasHeight/2 +5

                    // 节点框在上面
                    val.config.nodePosition = this.canvasHeight/2 - 105
                }

            })
            console.log('dddddd',this.dataList)
        },

        checkChinese(val){
            var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
            if(reg.test(val)){
                return true
            }else{
                return false
            }
        }
    },
    mounted(){
        // this.canvasWidth = document.getElementById('canvas').offsetWidth -100
        this.canvasHeight = this.divHeight

        this.$nextTick(()=>{
            this.drawCanvas()
            
        })

        window.onresize = () => {
            // this.canvasWidth = document.getElementById('canvas').offsetWidth -100
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
@blue:#517bee;
@border:2px solid #e6e6e6;

#canvas{
    padding: 50px;
    position: relative;
}
.detail-date{
    position: relative;
    .detail-date-content{
        position: absolute;
        transform: translateX(-50%);
        min-width: 200px;
        text-align: center;
        span{
            display: inline-block;
            color: @blue;
        } 
    }
}
.detail-node{
    position: relative;
    .detail-node-div{
        position: absolute;
        transform: translateX(-50%);
        
        text-align: center;
        border:@border;
        border-radius: 5px;
        background: #fff;
        // word-wrap:break-word;
        text-align: left;
        padding: 10px;
        max-width: 200px;
        min-width: 150px;
        .detail-node-title{
            // word-wrap:break-word;
            font-size: 16px;
            line-height: 18px;
            color: #333;
            font-weight: 600;
            
            span{
                // white-space:nowrap;
            }
        }
        .detail-node-content{
            // word-wrap:break-word;
            font-size: 14px;
            line-height: 20px;
            color: #666;
            span{
                // white-space:nowrap;
            }
        }
    }
}

.importantDate{
    font-size: 17px;
    font-weight: 700;
}
.normalDate{
    font-size: 14px;
}
.upNode{
    transform: translate(-50%,-100%)!important;
}

.with-chinese{
    word-break: break-all;
    // white-space: nowrap;
    word-wrap:break-word;
}
.without-chinese{
    word-break: break-all;
}
</style>