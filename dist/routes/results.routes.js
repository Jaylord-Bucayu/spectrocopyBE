"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultsRoute = void 0;
const results_controller_1 = require("../controllers/results.controller");
function ResultsRoute(app) {
    app.get('/results', results_controller_1.getAllResult);
    app.get("/results/:id", results_controller_1.getResultById);
    app.post("/results/create", results_controller_1.createResult);
    app.delete("/results/:id", results_controller_1.deleteResult);
    app.patch("/results/:id", results_controller_1.editResult);
}
exports.ResultsRoute = ResultsRoute;
//# sourceMappingURL=results.routes.js.map