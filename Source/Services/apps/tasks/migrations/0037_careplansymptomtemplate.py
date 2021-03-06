# Generated by Django 2.0.7 on 2019-04-17 16:33

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('plans', '0030_auto_20190327_1533'),
        ('tasks', '0036_auto_20190417_1023'),
    ]

    operations = [
        migrations.CreateModel(
            name='CarePlanSymptomTemplate',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('custom_start_on_day', models.IntegerField(blank=True, null=True)),
                ('custom_frequency', models.CharField(blank=True, choices=[('once', 'Once'), ('daily', 'Daily'), ('every_other_day', 'Every Other Day'), ('weekly', 'Weekly'), ('weekdays', 'Weekdays'), ('weekends', 'Weekends')], max_length=20)),
                ('custom_repeat_amount', models.IntegerField(blank=True, null=True)),
                ('custom_appear_time', models.TimeField(blank=True, null=True)),
                ('custom_due_time', models.TimeField(blank=True, null=True)),
                ('plan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='plan_symptom_templates', to='plans.CarePlan')),
                ('symptom_task_template', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='plan_symptom_templates', to='tasks.SymptomTaskTemplate')),
            ],
            options={
                'verbose_name': 'Care Plan Symptom Templates',
            },
        ),
    ]
