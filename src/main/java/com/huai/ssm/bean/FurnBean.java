package com.huai.ssm.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FurnBean {
    private int id;
    private String name;
    private String marker;
    private double price;
    private double sales;
    private double stock;
    private String imgPath;
}
