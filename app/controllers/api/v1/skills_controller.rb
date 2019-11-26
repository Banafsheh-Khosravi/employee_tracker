# frozen_string_literal: true

class Api::V1::SkillsController < ApplicationController
  before_action :find_records, only: :track_skill
  before_action :authenticate_user!

  def index
    skills = Skill.all
    response = { skills: skills, skill_proficiencies: EmployeeSkill.proficiencies }

    render json: response, status: :ok
  end

  def create
    skill = Skill.new(skill_params)

    if skill.save
      render json: { message: 'Skill added!' }, status: :created
    else
      render json: { message: 'Validation failed', errors: skill.errors },
             status: :conflict
    end
  end

  def track_skill
    if @user && @skill
      @user.employee_skill.build(skill: @skill, proficiency: params[:skill].dig(:proficiency))

      if @user.save!
        render json: { message: 'New skill tracked' }, status: :created
      else
        render json: @user.errors, status: :bad
      end
    else
      render json: { error: 'User or skill does not exist' }, status: :not_found
    end
  end

  private

  def skill_params
    params.require(:skill).permit(:name, :desc)
  end

  # def employee_skill_params
  #   params.require(:skill).permit(:user_id, :skill_id, :proficiency)
  # end

  def find_records
    @user = User.find(params[:skill].dig(:user_id))
    @skill = Skill.find(params[:skill].dig(:skill_id))
  end
end
