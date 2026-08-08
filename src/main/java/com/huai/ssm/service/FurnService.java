package com.huai.ssm.service;

import com.huai.ssm.bean.FurnBean;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


public interface FurnService {
    @Transactional
    void save(FurnBean furnBean);

    List<FurnBean> getAllFurns();

    @Transactional
    int updateFurn(FurnBean furnBean);

    FurnBean getDetailById(int id);

    @Transactional
    void removeDataById(int id);
}
