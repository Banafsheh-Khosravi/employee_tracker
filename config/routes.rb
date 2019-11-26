# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users, path: '/api/v1/users', defaults: { format: :json }
  namespace :api do
    namespace :v1 do
      get 'employees' => 'users#index', as: 'employees'
      post 'skill' => 'skills#create', as: 'new_skill'
      get 'skill' => 'skills#index', as: 'skills'
      post 'track_skill' => 'skills#track_skill', as: 'track_skill'
      get 'user_dashboard_info' => 'users#user_dashboard_info', as: 'user_dashboard_info'
      post 'create_employee' => 'users#create', as: 'create_employee'
      get 'user_skill_info/:id' => 'users#user_skill_info', as: 'user_skill_info'
    end
  end

  root 'home#index'
  get '/*path' => 'home#index'
  
end
