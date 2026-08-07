package com.huai.ssm.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Msg {
    //    code码
    private int code;
    //    提示信息
    private String msg;
    //    返回给前端的信息
    private Map<String, Object> data = new HashMap<String, Object>();

    public static Msg success() {
        Msg msg = new Msg();
        msg.code = 200;
        msg.msg = "success";
        return msg;
    }

    public static Msg fail() {
        Msg msg = new Msg();
        msg.code = 400;
        msg.msg = "fail";
        return msg;
    }

    public Msg add(String key, Object value) {
        this.getData().put(key, value);
        return this;
    }
}
