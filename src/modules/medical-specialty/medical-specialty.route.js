import { Router } from 'express';
import {
    getMedicalSpecialty,
    createMedicalSpecialty,
} from './medical-specialty.controller';

const medicalSpecialtyRoute = Router();

// lấy ra tất cả chuyên khoa
medicalSpecialtyRoute.get('/', getMedicalSpecialty);

// tạo chuyên khoa
medicalSpecialtyRoute.post('/', createMedicalSpecialty);

export { medicalSpecialtyRoute };
