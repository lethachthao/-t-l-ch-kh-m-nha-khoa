import { Router } from 'express';
import { medicalSpecialtyRoute } from '../modules/medical-specialty/medical-specialty.route';
import { userRoute } from '../modules/user/user.route';
import { authRoute } from '../modules/auth/auth.route';
import { scheduleRoute } from '../modules/schedule/schedule.route';

const routes = Router();

const apiRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/user',
        route: userRoute,
    },

    {
        path: '/medical-specialty',
        route: medicalSpecialtyRoute,
    },
    {
        path: '/schedule',
        route: scheduleRoute,
    },
];

// nó cái luồng nó như vậy đó em hiểu hông ạ? dạ rồi anh ơi

apiRoutes.forEach((route) => {
    // tạo route cho tất cả các path như /user, /appointment, /medical-specialty
    // lúc này mỗi path chính là 1 cái `group` route prefix, từ group route prefix anh sẽ dùng nó cho từng route cụ thể như userRoute, appointmentRoute, medicalSpecialtyRoute
    // như vậy nó sẽ như này:
    // /api/user  => pathname này sẽ có một route khác tên là userRoute xử lí riêng
    // /api/appointment  => pathname này sẽ có một route khác tên là appointmentRoute xử lí riêng
    // /api//medical-specialty  => pathname này sẽ có một route khác tên là medicalSpecialtyRoute xử lí riêng

    // em hiểu chưa em, cho em hỏi cái này ạ route: medicalSpecialtyRoute, là cái route mình chưa tạo , giờ mình tạo nè

    routes.use(route.path, route.route);
});

// em hiểu code chứ em? em lần đầu thấy anh ơi, mọi lần em làm người ta viết các router xong gọi từ controller vào anh ạ, anh giải thích em với

export { routes };
