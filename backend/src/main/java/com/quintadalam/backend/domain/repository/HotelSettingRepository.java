package com.quintadalam.backend.domain.repository;

import com.quintadalam.backend.domain.model.HotelSetting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotelSettingRepository extends JpaRepository<HotelSetting, String> {
}
