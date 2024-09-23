'use strict';
const {
  Model, DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Project.belongsTo(models.Project, { foreignKey: 'modelId' });
    }
  }
  Project.init({
    projectName: DataTypes.STRING,
    authorName: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    description: DataTypes.TEXT,
    technologies: DataTypes.ARRAY(DataTypes.STRING),
    imageUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};
