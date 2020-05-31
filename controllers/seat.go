package controllers

import (
	"encoding/json"
	"github.com/astaxie/beego/logs"
	"ttms/models"
)

type SeatController struct {
	BaseController
}

type SeatForSend struct {
	StId int64	`json:"st_id"`
	StuId int64	`json:"stu_id"`
	StRow int64	`json:"st_row"`
	StCol int64	`json:"st_col"`
	StStatus int64	`json:"st_status"` //座位状态 0正常 1坏 2墙壁
}
/*
查询演出厅的座位信息
 */
func (c *SeatController)GetSeat() {
	logs.Debug("查询座位")
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	//检查权限
	if ok := c.JudgeAuthority(models.MG_STU); !ok {
		return
	}

	id, err := c.GetInt64("stu_id")
	if err != nil {
		c.PackRecode(c.resp, models.RECODE_NODATA) //4002 没有收到ID
		return
	}
	logs.Debug("要查询的座位的演出厅ID是", id)

	var seats []*models.Seat
	//获取座位信息
	num, err2 := models.QuertOneToMany(models.SEAT, "Studio", id, &seats)
	if err2 != nil {
		c.PackRecode(c.resp, models.RECODE_DBERR)
		return
	}

	logs.Debug("%d seats read\n", num)
	s := []SeatForSend{}
	for _, seat := range seats {
		tmp := SeatForSend{StId:seat.StId,StuId:seat.Studio.StuId,StRow:seat.StRow,StCol:seat.StCol,StStatus:seat.StStatus}
		s = append(s,tmp)
		logs.Debug(*seat)
	}
	c.resp["sum"] =  num
	c.resp["data"] = s
	c.PackRecode(c.resp,models.RECODE_OK)
}

/*
修改座位信息,根据ID修改座位的状态
 */
func (c *SeatController)UpdateSeat() {
	logs.Debug("更改座位信息")
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	if ok := c.JudgeAuthority(models.MG_STU); !ok {
		return
	}


	data := models.Seat{}
	json.Unmarshal(c.Ctx.Input.RequestBody,&data)
	logs.Debug("从前段获取的数据是",data)

	_,err := models.UpdateByTablenameAndField(models.SEAT,"st_status",&data)

	//返回结果
	if err != nil {
		logs.Error(err)
		c.PackRecode(c.resp,models.RECODE_DBERR) //4001　插入失败
		return
	}
	c.PackRecode(c.resp,models.RECODE_OK)
}