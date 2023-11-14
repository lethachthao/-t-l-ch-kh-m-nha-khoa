import { Router } from 'express';
import {
    getMedicalSpecialty,
    createMedicalSpecialty,
    updateMedicalSpecialty,
    deleteMedicalSpecialty,
    getMedicalSpecialtyDetail,
} from './medical-specialty.controller';
import { uploadMiddleware } from '../../middlewares/upload.middleware';

const medicalSpecialtyRoute = Router();

// lấy ra tất cả chuyên khoa
medicalSpecialtyRoute.get('/', getMedicalSpecialty);

medicalSpecialtyRoute.get('/:id', getMedicalSpecialtyDetail);

// tạo chuyên khoa
medicalSpecialtyRoute.post(
    '/',
    uploadMiddleware().single('avatar'),
    createMedicalSpecialty,
);

medicalSpecialtyRoute.delete('/:id', deleteMedicalSpecialty);

medicalSpecialtyRoute.put(
    '/:id',
    uploadMiddleware().single('avatar'),
    updateMedicalSpecialty,
);

export { medicalSpecialtyRoute };
