(function(win, doc) {
  const MapServerToken =
    process.env.NODE_ENV === "production"
      ? "http://map.cn.gov/RemoteTokenServer?request=getToken&username=cnkwkf&password=cnkwkf12345&clientid=ref.http://bigdata.cn.gov:8060/&expiration=500"
      : "http://map.cn.gov/RemoteTokenServer?request=getToken&username=cnkwkf&password=cnkwkf12345&clientid=ref.http://localhost:8000/&expiration=500";
  win.getToken = function() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", MapServerToken, false);
    xmlhttp.send();
    let container = document.getElementById("txtToken");
    if (!container) {
      container = document.createElement("input");
      container.id = "txtToken";
      container.value = "1000";
      container.style += "display:none;width:500px;";
      document.body.appendChild(container);
    }
    container.value = xmlhttp.responseText;
    console.log(container.value);
  };

  const ipHesheng = "10.207.204.32";
  const portHs = 8080;
  const HsDomain = `http://${ipHesheng}:${portHs}`;

  const ipMobile = "10.207.184.66";
  const portMobile = 8090;
  const mobileDomain = `http://${ipMobile}:${portMobile}`;

  const ipUnicom = "192.168.11.203";
  const portUnicom = 8081;
  const unicomDomain = `http://${ipUnicom}:${portUnicom}`;
  win.conf = {
    token_HESHENG: "",
    hesheng: {
      //登录获取token 获取 实时告警信息
      loginUrl: `${HsDomain}/visdata/rest/auth/login`,
      //携带token （移动）-实时告警信息 @mobile_group://$.*;
      mobileAlarm: `${HsDomain}/visdata/rest/pagemanage/dataconvert/query?definedStr=${encodeURIComponent(
        "@mobile_group://$.*;"
      )}`,
      //携带token （联通）-实时告警信息 @unicom_group://$.*;
      unicomAlarm: `${HsDomain}/visdata/rest/pagemanage/dataconvert/query?definedStr=${encodeURIComponent(
        "@unicom_group://$.*;"
      )}`,
      //携带token (东方有线)-实时告警信息 @ocn_alarm_group://$.*;
      ocnAlarm: `${HsDomain}/visdata/rest/pagemanage/dataconvert/query?definedStr=${encodeURIComponent(
        "@ocn_alarm_group://$.*;"
      )}`,
      //携带token (中国电信)-告警数据 @chinatelecom_alarm_group://1:1-n:n;
      telecomAlarm: `${HsDomain}/visdata/rest/pagemanage/dataconvert/query?definedStr=${encodeURIComponent(
        "@chinatelecom_alarm_group://1:1-n:n;"
      )}`,
      //查寻健康 设备健康数据  `[{"name":"di","value":""}]`,
      telecomAlarmHealth: `${HsDomain}/visdata/rest/pagemanage/dataset/chinatelecom_health_group/esresult`,
      //中国电信一次查询所有健康
      telecomHealth: `${HsDomain}/visdata/rest/pagemanage/dataconvert/query?definedStr=${encodeURIComponent(
        "@chinatelecom_health_group://1:1-n:n;"
      )}`,
      // 中国电信：(中国电信-所有设备) @chinatelecom_all_device_group://1:1-n:n;
      telecomAllDevice: `${HsDomain}/visdata/rest/pagemanage/dataconvert/query?definedStr=${encodeURIComponent(
        "@chinatelecom_all_device_group://1:1-n:n;"
      )}`,
      telecomAlarmDevice: `${HsDomain}/visdata/rest/sign/signservice/alarm?id=chinatelecom_alarm_group&type=3`,
      //中国电信:(中国电信-所有设备) 坐标转化后台处理 get
      telecomAllDevice_XY: `${HsDomain}/visdata/rest/pagemanage/dataset/changningdianxingAll/result`,
      telecomDeviceSum: `${HsDomain}/visdata/rest/pagemanage/dataset/dianxingcount/result`,
      deviceTypeSum: `${HsDomain}/visdata/rest/pagemanage/dataset/changningdianxingtype/result`,
      //物联网四家告警设备统计
      alarmSum: `${HsDomain}/visdata/rest/sign/signservice/count`,
      alarmYesSum: `${HsDomain}/visdata/rest/pagemanage/dataset/changingyesterdaysum/result`,
      Alarm30Sum: `${HsDomain}/visdata/rest/pagemanage/dataset/changningsum/result`,
      Alarm30StreetSum: `${HsDomain}/visdata/rest/pagemanage/dataset/changningaddresssum/result`,
      //获取查询参数的签名sign ！首先携带参数和appkey生成sign 比如 移动
      signUrl: `${HsDomain}/visdata/rest/sign/signservice/getsign`,
      appkey: `hesheng`,
      username: "dituapi@dituapi.com",
      password: "dituapi"
    },
    ocn: {
      //`[{"name":"id","value":" ？ "}]`,查询
      //1、设备信息 经纬度
      baseUrl: `${HsDomain}/visdata/rest/pagemanage/dataset/ocn_device_group/esresult`,
      //2、性能数据
      performUrl: `${HsDomain}/visdata/rest/pagemanage/dataset/ocn_keepalive_group/esresult`,
      //3、根据value查询东方有线 所有 `value: gz32` 设备的经纬度
      allDeviceUrl: `${HsDomain}/visdata/rest/pagemanage/dataset/ocn_all_device_group/esresult`,
      allDeviceUrl_XY: `${HsDomain}/visdata/rest/pagemanage/dataset/ocn_all_device_without_param_group/result`,
      deviceSum: `${HsDomain}/visdata/rest/pagemanage/dataset/youxiancount/result`,
      deviceTypeSum: `${HsDomain}/visdata/rest/pagemanage/dataset/changningyouxiantype/result`,
      offLineList: `${HsDomain}/visdata/rest/pagemanage/dataset/changningdianxingoff/result`, //有线通不在线设备列表
      offLineSum: `${HsDomain}/visdata/rest/pagemanage/dataset/changningyouxianoffcount /result`, //有线通不在线设备数量
      offLineDeviceType: `${HsDomain}/visdata/rest/pagemanage/dataset/changningyouxianofftype/result`, //有线不在线设备类型
      alarmDevice: `${HsDomain}/visdata/rest/sign/signservice/alarm?id=ocn_alarm_group&type=4`
    },
    mobile: {
      //！首先携带参数和appkey生成sign 移动mobile_group
      baseUrl: `${mobileDomain}/dataAEx-N/device/getDeviceBaseInfo`, //1、设备基础信息
      detailUrl: `${mobileDomain}/dataAEx-N/device/getDeviceDetailInfo`, //2、设备详细信息 经纬度
      performUrl: `${mobileDomain}/dataAEx-N/device/getDevicePerformInfo`, //3、设备性能信息//begin_time end_time appkey
      allDevice: `${mobileDomain}/dataAEx-N/device/getDevicePerformInfoAll`, //上面通过token获取各个厂商实时告警信息 所有设备详细信息
      allDevice_XY: `${HsDomain}/visdata/rest/pagemanage/dataset/changningyidongAll/result`, //新接口 坐标转化后台处理 get
      deviceSum: `${HsDomain}/visdata/rest/pagemanage/dataset/yidongcount/result`,
      deviceTypeSum: `${HsDomain}/visdata/rest/pagemanage/dataset/changningyidongtype/result`,
      offLineList: `${HsDomain}/visdata/rest/pagemanage/dataset/changningyidongoff/result`, //移动不在线设备列表
      offLineSum: `${HsDomain}/visdata/rest/pagemanage/dataset/changningyidongoffcount/result`, //移动不在线设备数量
      offLineDeviceType: `${HsDomain}/visdata/rest/pagemanage/dataset/changningyidongofftype/result`, //移动不在线设备类型
      alarmDevice: `${HsDomain}/visdata/rest/sign/signservice/alarm?id=mobile_group&type=2`
    },
    unicom: {
      //联通unicom_group
      subscribeCode: "0RSTDE1544769008706", // // APIkey:"T8A6Qf6cEH3zUcapitek",//科委 的APIkey 是 T8A6Qf6cEH3zUcapitek 合胜添加传参数
      loginUrl: `${HsDomain}/visdata/rest/sign/signservice/auth`, //登录获取token
      deviceUrl: `${HsDomain}/visdata/rest/sign/signservice/device`, //使用生成的token值 来获取设备列表
      deviceHealth: `${HsDomain}/visdata/rest/pagemanage/dataset/unicom_health_group/esresult`,
      allDevice_XY: `${HsDomain}/visdata/rest/pagemanage/dataset/changningliantongall/result`,
      deviceSum: `${HsDomain}/visdata/rest/pagemanage/dataset/liantongcount/result`,
      deviceTypeSum: `${HsDomain}/visdata/rest/pagemanage/dataset/changningliantongtype/result`,
      alarmDevice: `${HsDomain}/visdata/rest/sign/signservice/alarm?id=unicom_group&type=1`
    },
    wlw: {
      //物联网类轮询时间
      leftTimer: 60000 * 5,
      alarmTimer: 30000 //告警、右侧告警统计 请求频率
    },
    HB: {
      //historyBuilding 历史建筑
      //左侧获取历史建筑数量
      L_count: `${HsDomain}/visdata/rest/pagemanage/dataset/cj_lishijianzhu_count/result`,
      //左侧年代数量
      L_bar: `${HsDomain}/visdata/rest/pagemanage/dataset/cj_lishijianzhu_construction_age_count/result`,
      //左侧等级统计
      L_pie: `${HsDomain}/visdata/rest/pagemanage/dataset/cj_lishijianzhu_cultural_relic_class_count/result`,
      //右侧当前月/前一个月巡查数量
      R_count: `${HsDomain}/visdata/rest/pagemanage/dataset/cj_lishijianzhu_xuncha_count/result`,
      //右侧巡查事件最新的10条
      R_events: `${HsDomain}/visdata/rest/pagemanage/dataset/cj_lishijianzhu_xuncha_events/result`,
      //右侧当月巡查事件类型数量
      R_type: `${HsDomain}/visdata/rest/pagemanage/dataset/cj_lishijianzhu_xuncha_event_type_count/result`,
      //右侧巡查事件30天统计
      R_month: `${HsDomain}/visdata/rest/pagemanage/dataset/cj_lishijianzhu_xuncha_event_month_count/result`
    },
    ROAD: {
      //road 路政交通
      //左侧掘路占路数量
      L_count1: `${HsDomain}/visdata/rest/pagemanage/dataset/cj_luzhen_juezhanlu_count/result`,
      //工地数量
      L_count2: `${HsDomain}/visdata/rest/pagemanage/dataset/cj_luzhen_gongdi_count/result`,
      //行政工程类型统计
      L_pie: `${HsDomain}/visdata/rest/pagemanage/dataset/cj_luzhen_gongchengleixing/result`,
      //竣工日期排行（掘路）
      L_juluBar: `${HsDomain}/visdata/rest/pagemanage/dataset/cj_luzhen_jungongriqi_juelu/result`,
      //竣工日期排行（占路）
      L_zhanluBar: `${HsDomain}/visdata/rest/pagemanage/dataset/cj_luzhen_jungongriqi_zhanlu/result`,
      //今日影响道路
      R_TOP1: `${HsDomain}/visdata/rest/pagemanage/dataset/cj_luzhen_jinri_yingxiangdaolu/result`,
      //昨日影响道路
      R_TOP2: `${HsDomain}/visdata/rest/pagemanage/dataset/cj_luzhen_zuoriri_yingxiangdaolu/result`,
      //城建工地投诉类型统计（当月）
      R_bar: `${HsDomain}/visdata/rest/pagemanage/dataset/cj_gongdi_tousuleixing_month/result`,
      //城建工地在建工地类型统计（当月）
      R_pie: `${HsDomain}/visdata/rest/pagemanage/dataset/cj_gongdi_gongdileixing_month/result`
    },
    RIVE: {
      //rive 河道巡查
      //城建河道河道数量
      L_count: `${HsDomain}/visdata/rest/pagemanage/dataset/cj_hedao_hedao_count/result`,
      //城建河道巡查事件（本月与上月）数量
      L_gongdi: `${HsDomain}/visdata/rest/pagemanage/dataset/cj_hedao_xuncha_count/result`,
      //城建河道巡查事件列表（最新10条）
      L_pie: `${HsDomain}/visdata/rest/pagemanage/dataset/cj_hedao_xuncha_events/result`,
      //巡查事件类型统计
      R_count: `${HsDomain}/visdata/rest/pagemanage/dataset/cj_hedao_xuncha_event_type/result`,
      //河道巡查趋势（月）
      R_events: `${HsDomain}/visdata/rest/pagemanage/dataset/cj_hedao_xuncha_qushi_month/result`,
      //河道事件趋势（年）
      R_type: `${HsDomain}/visdata/rest/pagemanage/dataset/cj_hedao_xuncha_qushi_year/result`
    }
  };
})(window, document);
