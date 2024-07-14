import { useNavigation } from '@react-navigation/native';
import { useState,useEffect, useContext } from 'react';
import {View,Text, SafeAreaView, StyleSheet,Switch, Animated,TouchableOpacity, Dimensions, ScrollView} from 'react-native'
import { LineChart } from 'react-native-chart-kit';
import { RootStackParamList } from "../type.ts";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Svg,G,Line,Circle,Text as SvgText, Path  } from 'react-native-svg';;
import { MQTTContext } from '../App.tsx';
type MainScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainScreen'>;
export default function MainScreen(){
    const data=useContext(MQTTContext).toString();
    const [curTime,setCurTime]=useState(1);
    const window_width_prev=Dimensions.get("window").width*0.15;
    const [window_width,setWindow_width]=useState(window_width_prev);
    const containerHeight=Dimensions.get("window").height*0.36/1.3;

    const humid_window_width_prev=Dimensions.get("window").width*0.15;
    const [humid_window_width,setHumid_window_width]=useState(humid_window_width_prev);
    const humid_containerHeight=Dimensions.get("window").height*0.7/1.3;


    const [line_chart_data, setLine_chart_data] = useState([{time:0},{time:1}]);
    const [line_chart_data1, setLine_chart_data1] = useState([
        {time:0,value:0},
        {time:1,value:0},
        {time:2,value:10},
    ]);
    const line_chart_data2=[
        {time:0,value:0},
        {time:1,value:1},
        {time:2,value:10},
    ];

    const tempLable=[{value:0},{value:10},{value:20},{value:30},{value:40},{value:50}];
    const humidLable=[{value:0},{value:10},{value:20},{value:30},{value:40},{value:50},{value:60},{value:70},{value:80},{value:90},{value:100}];
    
    const [isEnable,setIsEnable]= useState(true);
    const [text,setText]= useState('on');
    const [temp,setTemp]=useState("25");
    const [humid,setHumid]=useState("80");
    const [flag,setFlag]=useState("");
    const [prevFlag, setPrevFlag] = useState("");

    useEffect(() => {
        if (flag !== prevFlag) {
            const newTime = curTime + 1;
            setCurTime(newTime);
            const newValue = parseFloat(data.split('-')[0]); // Chuyển đổi dữ liệu MQTT thành giá trị số
            setLine_chart_data(prevData => [...prevData, { time: newTime, value: newValue }]);

            // Tăng chiều rộng của biểu đồ mỗi khi có điểm dữ liệu mới
            setWindow_width(prevWidth => prevWidth + Dimensions.get("window").width * 0.15);
            setHumid_window_width(prevWidth => prevWidth + Dimensions.get("window").width * 0.15);
            setPrevFlag(flag);

            // const newTime1 = line_chart_data1[line_chart_data1.length - 1].time + 1;
            // const newValue1 = parseFloat(data.split('-')[0]);
            // setLine_chart_data1(prevData => [...prevData, { time: newTime1, value: newValue1 }]);
            // for(var i=0;i<line_chart_data1.length;i++){
            //     console.log(line_chart_data1[i].time+"-"+line_chart_data1[i].value+"\n");
            // }
        }
    }, [flag, prevFlag, data, curTime]);

    useEffect(() => {
        const newTemp = data.split('-')[0];
        const newHumid = data.split('-')[1];
        const newFlag = data.split('-')[2];
        if (newFlag !== flag) {
            setTemp(newTemp);
            setHumid(newHumid);
            setFlag(newFlag);
        }
    }, [data, flag]);


    const navigation=useNavigation<MainScreenNavigationProp>();
    const marginFor_X_fromLeft=40;
    const marginFor_y_FromBottom=40;
    const padding_from_screenBorder=11;

    const humid_marginFor_X_fromLeft=40;
    const humid_marginFor_y_FromBottom=40;
    const humid_padding_from_screenBorder=11;

    const x_axis_x1_point=marginFor_X_fromLeft;
    const x_axis_y1_point=containerHeight-marginFor_y_FromBottom;
    const x_axis_x2_point=window_width-padding_from_screenBorder;
    const x_axis_y2_point=containerHeight-marginFor_y_FromBottom;
    const x_axis_actual_width=window_width-marginFor_y_FromBottom-padding_from_screenBorder;
    const gap_between_x_axis_ticks=x_axis_actual_width/(line_chart_data.length-1);

    const humid_x_axis_x1_point=humid_marginFor_X_fromLeft;
    const humid_x_axis_y1_point=humid_containerHeight-humid_marginFor_y_FromBottom;
    const humid_x_axis_x2_point=humid_window_width-humid_padding_from_screenBorder;
    const humid_x_axis_y2_point=humid_containerHeight-humid_marginFor_y_FromBottom;
    const humid_x_axis_actual_width=humid_window_width-humid_marginFor_y_FromBottom-humid_padding_from_screenBorder;
    const humid_gap_between_x_axis_ticks=humid_x_axis_actual_width/(line_chart_data.length-1);

    const y_axis_x1_point=marginFor_X_fromLeft;
    const y_axis_y1_point=padding_from_screenBorder;
    const y_axis_x2_point=marginFor_X_fromLeft;
    const y_axis_y2_point=containerHeight-marginFor_y_FromBottom;

    const humid_y_axis_x1_point=humid_marginFor_X_fromLeft;
    const humid_y_axis_y1_point=humid_padding_from_screenBorder+humid_containerHeight*0.485;
    const humid_y_axis_x2_point=humid_marginFor_X_fromLeft;
    const humid_y_axis_y2_point=humid_containerHeight-humid_marginFor_y_FromBottom;
    
    const y_min_value=0;
    const y_max_value=Math.max.apply(
        Math,
        tempLable.map((item)=>item.value)

    );

    const humid_y_min_value=0;
    const humid_y_max_value=Math.max.apply(
        Math,
        humidLable.map((item)=>item.value)

    );


    const gapBetweenYAxisValues=(y_max_value-y_min_value)/(5);
    const y_axis_actual_height=y_axis_y2_point-y_axis_y1_point;
    const gap_between_y_axis_ticks=(y_axis_actual_height-y_min_value)/(5);
    const [yAxisLabels,setYAxisLabels]=useState([]);

    const humid_gapBetweenYAxisValues=(humid_y_max_value-humid_y_min_value)/(10);
    const humid_y_axis_actual_height=humid_y_axis_y2_point-humid_y_axis_y1_point;
    const humid_gap_between_y_axis_ticks=(humid_y_axis_actual_height-humid_y_min_value)/(10);
    const [humid_yAxisLabels,humid_setYAxisLabels]=useState([]);


    useEffect(()=>{
        const yAxisData=tempLable.map((item,index)=>{
            if(index===0){
                return y_min_value;
            }else{
                return y_min_value+gapBetweenYAxisValues*index;
            }
        });
        setYAxisLabels(yAxisData);

        const humid_yAxisData=humidLable.map((item,index)=>{
            if(index===0){
                return humid_y_min_value;
            }else{
                return humid_y_min_value+humid_gapBetweenYAxisValues*index;
            }
        });
        humid_setYAxisLabels(humid_yAxisData);
    },[])

    // const addNewDataPoint = () => {
    //     setWindow_width(prevWidth => prevWidth + Dimensions.get("window").width * 0.05);
    //     setHumid_window_width(prevWidth => prevWidth + Dimensions.get("window").width * 0.05);
        
    //     // Sử dụng hàm callback để cập nhật curTime và tạo newDataPoint
    //     setCurTime(prevTime => {
    //       const newTime = prevTime + 1;
    //       const newDataPoint = { time: newTime };
    //       setLine_chart_data(prevData => [...prevData, newDataPoint]);
    //       return newTime;
    //     });
    //   };
      
    //   useEffect(() => {
    //     const interval = setInterval(addNewDataPoint, 1000);
    //     return () => clearInterval(interval);
    //   }, []);


    const render_x_y_axis=()=>{
        return (
            <G key="x-axis y-axis">
                <Circle
                    cx={x_axis_x1_point}
                    cy={x_axis_y1_point}
                    fill={"#ccc"}
                    r={5}
                />

                <Circle
                    key="x-axis x2y2-circle"
                    cx={x_axis_x2_point}
                    cy={x_axis_y2_point}
                    fill={"#ccc"}
                    r={5}
                />

                <Circle
                    key="y-axis x1y1-circle"
                    cx={y_axis_x1_point}
                    cy={y_axis_y1_point}
                    fill={"#ccc"}
                    r={5}
                />

                <Line
                    key="x-axis"
                    x1={x_axis_x1_point}
                    y1={x_axis_y1_point}
                    x2={x_axis_x2_point}
                    y2={x_axis_y2_point}
                    stroke="#fff"
                    strokeWidth={2}
                />

                <Line
                    key="y-axis"
                    x1={y_axis_x1_point}
                    y1={y_axis_y1_point}
                    x2={y_axis_x2_point}
                    y2={y_axis_y2_point}
                    stroke="#fff"
                    strokeWidth={2}
                />
            </G>
        );
    }

    const humid_render_x_y_axis=()=>{
        return (
            <G key="humid_x-axis y-axis">
                <Circle
                    cx={humid_x_axis_x1_point}
                    cy={humid_x_axis_y1_point}
                    fill={"#ccc"}
                    r={5}
                />

                <Circle
                    key="humid_x-axis x2y2-circle"
                    cx={humid_x_axis_x2_point}
                    cy={humid_x_axis_y2_point}
                    fill={"#ccc"}
                    r={5}
                />

                <Circle
                    key="humid_y-axis x1y1-circle"
                    cx={humid_y_axis_x1_point}
                    cy={humid_y_axis_y1_point}
                    fill={"#ccc"}
                    r={5}
                />

                <Line
                    key="humid_x-axis"
                    x1={humid_x_axis_x1_point}
                    y1={humid_x_axis_y1_point}
                    x2={humid_x_axis_x2_point}
                    y2={humid_x_axis_y2_point}
                    stroke="#fff"
                    strokeWidth={2}
                />

                <Line
                    key="humid_y-axis"
                    x1={humid_y_axis_x1_point}
                    y1={humid_y_axis_y1_point}
                    x2={humid_y_axis_x2_point}
                    y2={humid_y_axis_y2_point}
                    stroke="#fff"
                    strokeWidth={2}
                />
            </G>
        );
    }

    const render_x_axis_labels_and_ticks=()=>{
        return line_chart_data.map((item,index)=>{
            let x_point = x_axis_x1_point+gap_between_x_axis_ticks*index;
            return (
                <G key={`x-axis labels and ticks${index}`}>
                    <Line
                    key={`x-axis-tick${index}`}
                    x1={x_point}
                    y1={x_axis_y1_point}
                    x2={x_point}
                    y2={x_axis_y1_point+10}
                    strokeWidth={2}
                    stroke={"#ccc"}
                    />

                    <SvgText
                        x={x_point}
                        y={x_axis_y1_point+20}
                        fill={"#fff"}
                        textAnchor='middle'
                    >
                        {item?.time}
                    </SvgText>
                </G>
            );
        })
    }

    const humid_render_x_axis_labels_and_ticks=()=>{
        return line_chart_data.map((item,index)=>{
            let humid_x_point = humid_x_axis_x1_point+humid_gap_between_x_axis_ticks*index;
            return (
                <G key={`humid_x-axis labels and ticks${index}`}>
                    <Line
                    key={`humid_x-axis-tick${index}`}
                    x1={humid_x_point}
                    y1={humid_x_axis_y1_point}
                    x2={humid_x_point}
                    y2={humid_x_axis_y1_point+10}
                    strokeWidth={2}
                    stroke={"#ccc"}
                    />

                    <SvgText
                        x={humid_x_point}
                        y={humid_x_axis_y1_point+20}
                        fill={"#fff"}
                        textAnchor='middle'
                    >
                        {item?.time}
                    </SvgText>
                </G>
            );
        })
    }

    const render_y_axis_labels_and_ticks=()=>{
        return yAxisLabels.map((item,index)=>{
            let y_point =y_axis_y2_point-gap_between_y_axis_ticks*index;
            return (
                <G
                    key={`y-axis labels and ticks${index}`}
                >
                    <Line
                        key={`y-axis ticks${index}`}
                        x1={marginFor_X_fromLeft}
                        y1={y_point}
                        x2={marginFor_X_fromLeft-10}
                        y2={y_point}
                        stroke={"#ccc"}
                        strokeWidth={2}
                    />
                    <SvgText
                        key={`y-axis label${index}`}
                        x={marginFor_X_fromLeft-25}
                        y={y_point}
                        fill={"#ccc"}
                        textAnchor='end'
                    >
                        {item}°C
                    </SvgText>
                </G>
            );
        });
    }

    const humid_render_y_axis_labels_and_ticks=()=>{
        return humid_yAxisLabels.map((item,index)=>{
            let humid_y_point =humid_y_axis_y2_point-humid_gap_between_y_axis_ticks*index;
            return (
                <G
                    key={`humid_y-axis labels and ticks${index}`}
                >
                    <Line
                        key={`humid_y-axis ticks${index}`}
                        x1={humid_marginFor_X_fromLeft}
                        y1={humid_y_point}
                        x2={humid_marginFor_X_fromLeft-10}
                        y2={humid_y_point}
                        stroke={"#ccc"}
                        strokeWidth={2}
                    />
                    <SvgText
                        key={`humid_y-axis label${index}`}
                        x={humid_marginFor_X_fromLeft-23}
                        y={humid_y_point}
                        fill={"#ccc"}
                        textAnchor='end'
                    >
                        {item}%
                    </SvgText>
                </G>
            );
        });
    }


    const getDPath=()=>{
        const maxValueAtYAxis=yAxisLabels[yAxisLabels.length-1];
        if(maxValueAtYAxis){
            let dPath='';
            line_chart_data1.map((item,index)=>{
                let x_point = x_axis_x1_point+gap_between_x_axis_ticks*item.time;
                let y_point =(maxValueAtYAxis-item.value) * (gap_between_y_axis_ticks/gapBetweenYAxisValues)+padding_from_screenBorder;
                if(index===0){
                    dPath+= `M${x_point} ${y_point}`
                }else{
                    dPath+= `L${x_point} ${y_point}`
                }
            })
            return dPath;
        }
    }
    const render_lineChart_path=()=>{
        const dPath=getDPath();
        return (
            <Path
                d={dPath}
                strokeWidth={2}
                stroke={"#ccc"}
            />
        );
    }

    const humid_getDPath=()=>{
        const humid_maxValueAtYAxis=humid_yAxisLabels[humid_yAxisLabels.length-1];
        if(humid_maxValueAtYAxis){
            let humid_dPath='';
            line_chart_data2.map((item,index)=>{
                let humid_x_point = humid_x_axis_x1_point+humid_gap_between_x_axis_ticks*item.time;
                let humid_y_point =Dimensions.get("window").height*0.34/1.3+(humid_maxValueAtYAxis-item.value) * (humid_gap_between_y_axis_ticks/humid_gapBetweenYAxisValues)+humid_padding_from_screenBorder;
                if(index===0){
                    humid_dPath+= `M${humid_x_point} ${humid_y_point}`
                }else{
                    humid_dPath+= `L${humid_x_point} ${humid_y_point}`
                }
            })
            return humid_dPath;
        }
    }
    const humid_render_lineChart_path=()=>{
        const humid_dPath=humid_getDPath();
        return (
            <Path
                d={humid_dPath}
                strokeWidth={2}
                stroke={"#ccc"}
            />
        );
    }

    const render_lineChart_circles_values=()=>{
        const maxValueAtYAxis=yAxisLabels[yAxisLabels.length-1];
        if(maxValueAtYAxis){
            return line_chart_data1.map((item,index)=>{
                let x_point = x_axis_x1_point+gap_between_x_axis_ticks*item.time;
                let y_point =(maxValueAtYAxis-item.value) * (gap_between_y_axis_ticks/gapBetweenYAxisValues)+padding_from_screenBorder;
                return (
                    <G
                        key={`line chart circles${item.time}`}
                    >
                        <Circle
                            cx={x_point}
                            cy={y_point}
                            r={5}
                            fill={"#ccc"}
                        />
                        <SvgText
                            x={x_point}
                            y={y_point-10}
                            fill={"#ccc"}
                            textAnchor='middle'
                        >{item.value}</SvgText>
                    </G>
                );
            })
        }
    }

    const humid_render_lineChart_circles_values=()=>{
        const humid_maxValueAtYAxis=humid_yAxisLabels[humid_yAxisLabels.length-1];
        if(humid_maxValueAtYAxis){
            return line_chart_data2.map((item,index)=>{
                let humid_x_point = humid_x_axis_x1_point+humid_gap_between_x_axis_ticks*item.time;
                let humid_y_point =Dimensions.get("window").height*0.34/1.3+(humid_maxValueAtYAxis-item.value) * (humid_gap_between_y_axis_ticks/humid_gapBetweenYAxisValues)+humid_padding_from_screenBorder;
                return (
                    <G
                        key={`humid_line chart circles${item.time}`}
                    >
                        <Circle
                            cx={humid_x_point}
                            cy={humid_y_point}
                            r={5}
                            fill={"#ccc"}
                        />

                        <SvgText
                            x={humid_x_point}
                            y={humid_y_point-10}
                            fill={"#ccc"}
                            textAnchor='middle'
                        >
                            {item.value}
                        </SvgText>
                    </G>
                );
            })
        }
    }


    const toggleSwitch=()=>{
        if(isEnable){
            setText('on');
            console.log(text);
        }else{
            setText('off');
            console.log(text);
        }

        setIsEnable(previousState => !previousState)
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.buttonContainer}>
                <View style={styles.thContainer}>
                    <View style={styles.thSetting}>
                        <Text style={{fontSize:18, color:"white"}}>Temperature</Text>
                        <Text style={{fontSize:20, color:"white"}}>{temp}°C</Text>
                    </View>
                    <View style={styles.thSetting}>
                        <Text style={{fontSize:18, color:"white"}}>Humidity</Text>
                        <Text style={{fontSize:20, color:"white"}}>{humid}%</Text>
                    </View>
                </View>

                <View style={styles.settingContainer}>
                    <Switch
                        onValueChange={toggleSwitch}
                        value={isEnable}
                        style={{marginLeft:"23%", marginRight:"23%"}}
                        trackColor={{false:"grey", true:"grey"}}
                        thumbColor={isEnable?"lightgreen":"red"}
                    >

                    </Switch>
                    <TouchableOpacity style={styles.setupContainer}
                        onPress={()=>{
                            navigation.navigate('SetUp');
                        }}
                    >
                        <Text style={{fontSize:24,color:"white", fontFamily:"times",fontWeight:"bold"}}>Set up</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
            <View style={styles.dataContainer}>
                <ScrollView horizontal={true}>
                    <Svg style={styles.svgStyle}>
                        {render_x_y_axis()}
                        {humid_render_x_y_axis()}
                        {render_x_axis_labels_and_ticks()}
                        {humid_render_x_axis_labels_and_ticks()}
                        {render_y_axis_labels_and_ticks()}
                        {humid_render_y_axis_labels_and_ticks()}
                        {render_lineChart_path()}
                        {humid_render_lineChart_path()}
                        {render_lineChart_circles_values()}
                        {humid_render_lineChart_circles_values()}
                    </Svg>
                </ScrollView>
            </View>

            <View style={styles.connectContainer}>
                    <TouchableOpacity style={styles.ipButton}
                    >
                        <Text style={{fontSize:24,color:"white", fontFamily:"times",fontWeight:"bold"}}>Wifi</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.ipButton}
                    >
                        <Text style={{fontSize:24,color:"white", fontFamily:"times",fontWeight:"bold"}}>Ethernet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.ipButton}
                    >
                        <Text style={{fontSize:24,color:"white", fontFamily:"times",fontWeight:"bold"}}>Bluetooth</Text>
                    </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#097b51",
        justifyContent:"space-around",
    },
    buttonContainer:{
        flex:0.2,
    },
    thContainer:{
        flex:0.5,
        flexDirection:"row",
        justifyContent:"space-evenly",
        alignItems:"center",
    },
    thSetting:{
        width:"30%",
        height:"90%",
        backgroundColor:"#097b51",
        borderColor:"yellow",
        borderWidth:2,
        borderRadius:10,
        justifyContent:"center",
        alignItems:"center",
    },
    settingContainer:{
        flex:0.5,
        flexDirection:"row",
        alignItems:"center",
    },
    setupContainer:{
        width:"30%",
        height:"60%",
        backgroundColor:"#097b51",
        borderColor:"yellow",
        borderWidth:2,
        borderRadius:10,
        justifyContent:"center",
        alignItems:"center",
    },
    dataContainer:{
        flex:0.6,
        backgroundColor:"black",
        borderWidth:5,
        borderRadius:10,
    },
    svgStyle:{
        // width:Dimensions.get("window").width*0.975, // from react-native
        width:Dimensions.get("window").width*12,
        height:Dimensions.get("window").height*0.68/1.3,
        //backgroundColor:"#04512d",
        backgroundColor:"black",
    },
    connectContainer:{
        flex:0.2,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
    },
    ipButton:{
        width:"30%",
        height:"60%",
        backgroundColor:"#097b51",
        borderColor:"yellow",
        borderWidth:2,
        borderRadius:10,
        justifyContent:"center",
        alignItems:"center",
    },
})