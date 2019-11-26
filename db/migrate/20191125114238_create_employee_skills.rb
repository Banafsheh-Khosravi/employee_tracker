class CreateEmployeeSkills < ActiveRecord::Migration[6.0]
  def change
    create_table :employee_skills do |t|
      t.references :user, null: false, foreign_key: true
      t.references :skill, null: false, foreign_key: true
      t.integer :proficiency

      t.timestamps
    end
    add_index :employee_skills, :proficiency
  end
end
