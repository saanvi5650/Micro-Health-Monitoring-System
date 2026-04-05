class HealthReport {
    constructor(name, age, temperature, cough, bp, symptoms) {
        this.name = name;
        this.age = age;
        this.temperature = temperature;
        this.cough = cough;
        this.bp = bp;
        this.symptoms = symptoms;
        this.riskLevel = "Low";
        this.createdAt = new Date();
    }
}

module.exports = HealthReport;