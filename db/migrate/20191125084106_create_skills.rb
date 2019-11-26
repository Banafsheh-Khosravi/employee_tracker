# frozen_string_literal: true

class CreateSkills < ActiveRecord::Migration[6.0]
  def change
    create_table :skills do |t|
      t.string :name, null: false
      t.text :desc

      t.timestamps
    end
    add_index :skills, :name, unique: true
  end
end
